import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ShareWork auth database seed...');

  // Clear existing data
  await prisma.escrow.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.job.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users with new auth fields
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sharework.com',
      password_hash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
      profile: {
        create: {
          display_name: 'ShareWork Admin',
          trust_score: 100.0,
          level: 10,
          badges: {
            verified: true,
            admin: true,
          },
        },
      },
    },
  });

  const client1 = await prisma.user.create({
    data: {
      email: 'john@client.com',
      password_hash: await bcrypt.hash('client123', 10),
      role: 'CLIENT',
      status: 'ACTIVE',
      profile: {
        create: {
          display_name: 'John Smith (Client)',
          trust_score: 85.5,
          level: 5,
          badges: {
            verified: true,
            premium: true,
          },
        },
      },
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'sarah@startup.com',
      password_hash: await bcrypt.hash('client123', 10),
      role: 'CLIENT',
      status: 'ACTIVE',
      profile: {
        create: {
          display_name: 'Sarah Johnson (Startup)',
          trust_score: 92.0,
          level: 7,
          badges: {
            verified: true,
            startup: true,
          },
        },
      },
    },
  });

  const freelancer1 = await prisma.user.create({
    data: {
      email: 'mike@freelancer.com',
      password_hash: await bcrypt.hash('freelancer123', 10),
      role: 'FREELANCER',
      status: 'ACTIVE',
      profile: {
        create: {
          display_name: 'Mike Developer',
          trust_score: 96.5,
          level: 8,
          badges: {
            verified: true,
            expert: true,
            top_rated: true,
          },
        },
      },
    },
  });

  const freelancer2 = await prisma.user.create({
    data: {
      email: 'anna@designer.com',
      password_hash: await bcrypt.hash('freelancer123', 10),
      role: 'FREELANCER',
      status: 'ACTIVE',
      profile: {
        create: {
          display_name: 'Anna UI/UX Designer',
          trust_score: 89.2,
          level: 6,
          badges: {
            verified: true,
            design_expert: true,
          },
        },
      },
    },
  });

  // Create demo Google OAuth user (no password)
  const googleUser = await prisma.user.create({
    data: {
      email: 'demo@google.com',
      role: 'CLIENT',
      status: 'ACTIVE',
      google_id: 'demo-google-id-12345',
      profile: {
        create: {
          display_name: 'Demo Google User',
          trust_score: 75.0,
          level: 3,
          badges: {
            verified: true,
            google_auth: true,
          },
        },
      },
    },
  });

  // Create Jobs
  const job1 = await prisma.job.create({
    data: {
      owner_user_id: client1.id,
      type: 'FIXED',
      title: 'Build E-commerce Website with Payment Integration',
      description: 'Looking for an experienced full-stack developer to build a modern e-commerce website with Stripe payment integration, user authentication, and admin dashboard.',
      location: 'Remote',
      budget_min: 3000.00,
      budget_max: 5000.00,
      status: 'OPEN',
    },
  });

  const job2 = await prisma.job.create({
    data: {
      owner_user_id: client2.id,
      type: 'HOURLY',
      title: 'Mobile App UI/UX Design',
      description: 'Need a creative UI/UX designer to create wireframes and high-fidelity mockups for a social networking mobile app. Must have experience with Figma.',
      location: 'Remote',
      budget_min: 40.00,
      budget_max: 75.00,
      status: 'OPEN',
    },
  });

  const job3 = await prisma.job.create({
    data: {
      owner_user_id: googleUser.id,
      type: 'FIXED',
      title: 'WordPress Website Migration & SEO Optimization',
      description: 'Need to migrate existing WordPress site to new hosting, improve site speed, and implement SEO best practices. Experience with WordPress and SEO required.',
      location: 'Remote',
      budget_min: 1200.00,
      budget_max: 2000.00,
      status: 'IN_PROGRESS',
    },
  });

  // Create Proposals
  await prisma.proposal.create({
    data: {
      job_id: job1.id,
      bidder_user_id: freelancer1.id,
      amount: 4200.00,
      status: 'PENDING',
    },
  });

  await prisma.proposal.create({
    data: {
      job_id: job2.id,
      bidder_user_id: freelancer2.id,
      amount: 55.00,
      status: 'ACCEPTED',
    },
  });

  await prisma.proposal.create({
    data: {
      job_id: job3.id,
      bidder_user_id: freelancer1.id,
      amount: 1500.00,
      status: 'PENDING',
    },
  });

  console.log('✅ ShareWork auth database seeded successfully!');
  console.log(`👤 Created ${await prisma.user.count()} users`);
  console.log(`👥 Created ${await prisma.profile.count()} profiles`);
  console.log(`💼 Created ${await prisma.job.count()} jobs`);
  console.log(`📝 Created ${await prisma.proposal.count()} proposals`);
  console.log('🔐 Auth features ready: Registration, Login, Google OAuth, 2FA');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });