import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, authorizeRoles, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication and admin authorization to all routes
router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

// GET /admin/dashboard - Admin dashboard (protected route example)
router.get('/dashboard', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get platform statistics
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'FREELANCER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.job.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.job.count({ where: { status: 'COMPLETED' } }),
      prisma.proposal.count(),
      prisma.contract.count(),
    ]);

    const [
      totalUsers,
      clientCount,
      freelancerCount,
      adminCount,
      totalJobs,
      openJobs,
      inProgressJobs,
      completedJobs,
      totalProposals,
      totalContracts,
    ] = stats;

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { profile: true },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        profile: {
          select: {
            display_name: true,
          },
        },
      },
    });

    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        owner: {
          include: { profile: true },
        },
        _count: {
          select: { proposals: true },
        },
      },
    });

    res.json({
      message: 'Admin dashboard data',
      adminUser: {
        id: req.user!.id,
        email: req.user!.email,
        role: req.user!.role,
      },
      stats: {
        users: {
          total: totalUsers,
          clients: clientCount,
          freelancers: freelancerCount,
          admins: adminCount,
        },
        jobs: {
          total: totalJobs,
          open: openJobs,
          inProgress: inProgressJobs,
          completed: completedJobs,
        },
        proposals: totalProposals,
        contracts: totalContracts,
      },
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/users - Get all users (with pagination)
router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: { profile: true },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          google_id: true,
          two_factor_secret: true,
          created_at: true,
          updated_at: true,
          profile: true,
        },
      }),
      prisma.user.count(),
    ]);

    const usersWithoutSecrets = users.map(user => ({
      ...user,
      hasTwoFactor: !!user.two_factor_secret,
      hasGoogleAuth: !!user.google_id,
      two_factor_secret: undefined,
    }));

    res.json({
      users: usersWithoutSecrets,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /admin/users/:userId/status - Update user status
router.put('/users/:userId/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'SUSPENDED', 'DELETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Don't allow admins to suspend themselves
    if (userId === req.user!.id && status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      include: { profile: true },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        profile: true,
      },
    });

    res.json({
      message: 'User status updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Admin update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;