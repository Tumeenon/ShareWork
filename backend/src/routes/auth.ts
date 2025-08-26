import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { 
  generateTwoFactorSecret, 
  generateQRCode, 
  verifyTwoFactorToken 
} from '../utils/twoFactor';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import passport from '../config/passport';

const router = Router();
const prisma = new PrismaClient();

// POST /auth/register - Email & password registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'CLIENT' } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password_hash,
        role: role.toUpperCase(),
        profile: {
          create: {
            display_name: email.split('@')[0],
            trust_score: 0.0,
            level: 1,
            badges: {},
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login - Email/password login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, twoFactorToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Check 2FA if enabled
    if (user.two_factor_secret) {
      if (!twoFactorToken) {
        return res.status(200).json({ 
          message: 'Two-factor authentication required',
          requiresTwoFactor: true 
        });
      }

      const isValidTwoFactor = verifyTwoFactorToken(twoFactorToken, user.two_factor_secret);
      if (!isValidTwoFactor) {
        return res.status(401).json({ error: 'Invalid two-factor authentication code' });
      }
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        hasTwoFactor: !!user.two_factor_secret,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/refresh - Refresh access token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /auth/oauth/google - Initiate Google OAuth
router.get('/oauth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/oauth/google/callback - Google OAuth callback
router.get('/oauth/google/callback',
  passport.authenticate('google', { session: false }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const tokens = generateTokenPair(tokenPayload);

      // Redirect to frontend with tokens (in production, use secure methods)
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error`);
    }
  }
);

// POST /auth/oauth/google - Alternative Google OAuth endpoint
router.post('/oauth/google', async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;
    
    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // In a real implementation, verify the Google token here
    // For now, this is a placeholder
    res.status(501).json({ error: 'Google token verification not implemented' });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/2fa/setup - Setup two-factor authentication
router.post('/2fa/setup', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Check if 2FA is already enabled
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { two_factor_secret: true },
    });

    if (user?.two_factor_secret) {
      return res.status(400).json({ error: 'Two-factor authentication is already enabled' });
    }

    // Generate 2FA secret
    const twoFactorSetup = generateTwoFactorSecret(req.user!.email);
    const qrCodeDataUrl = await generateQRCode(twoFactorSetup.qrCodeUrl);

    // Store the secret temporarily (in production, store in a temporary table)
    await prisma.user.update({
      where: { id: userId },
      data: { two_factor_secret: twoFactorSetup.secret },
    });

    res.json({
      secret: twoFactorSetup.secret,
      qrCode: qrCodeDataUrl,
      manualEntryKey: twoFactorSetup.manualEntryKey,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/2fa/verify - Verify and enable 2FA
router.post('/2fa/verify', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token } = req.body;
    const userId = req.user!.id;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Get user's 2FA secret
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { two_factor_secret: true },
    });

    if (!user?.two_factor_secret) {
      return res.status(400).json({ error: 'Two-factor authentication is not set up' });
    }

    // Verify the token
    const isValid = verifyTwoFactorToken(token, user.two_factor_secret);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ message: 'Two-factor authentication verified successfully' });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /auth/2fa/disable - Disable two-factor authentication
router.delete('/2fa/disable', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { password, token } = req.body;
    const userId = req.user!.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password_hash: true, two_factor_secret: true },
    });

    if (!user?.two_factor_secret) {
      return res.status(400).json({ error: 'Two-factor authentication is not enabled' });
    }

    // Verify password (if user has one)
    if (user.password_hash && password) {
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Verify 2FA token
    if (!token || !verifyTwoFactorToken(token, user.two_factor_secret)) {
      return res.status(401).json({ error: 'Invalid two-factor authentication code' });
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { two_factor_secret: null },
    });

    res.json({ message: 'Two-factor authentication disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /auth/me - Get current user info
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { profile: true },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        two_factor_secret: true,
        created_at: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...user,
      hasTwoFactor: !!user.two_factor_secret,
      two_factor_secret: undefined, // Don't expose the secret
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;