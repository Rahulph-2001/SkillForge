import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const passwordHash = await bcrypt.hash('demo123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Upsert Demo Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillforge.com' },
    update: {
      passwordHash: adminPasswordHash,
      isActive: true,
      isDeleted: false,
      role: 'admin',
    },
    create: {
      name: 'Demo Admin',
      email: 'admin@skillforge.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
      verification: {
          email_verified: true,
          email_verified_at: new Date().toISOString(),
      }
    },
  });

  console.log('Admin seeded:', admin.email);

  // 2. Upsert Demo User
  const user = await prisma.user.upsert({
    where: { email: 'demo@skillforge.com' },
    update: {
      passwordHash: passwordHash,
      isActive: true,
      isDeleted: false,
      role: 'user',
      credits: 10000,
      walletBalance: 10000,
    },
    create: {
      name: 'Demo User',
      email: 'demo@skillforge.com',
      passwordHash: passwordHash,
      role: 'user',
      isActive: true,
      credits: 10000,
      walletBalance: 10000,
      verification: {
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          bank_details: {
            verified: true
          }
      }
    },
  });

  console.log('User seeded:', user.email);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
