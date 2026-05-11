import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moodtravel.com' },
    update: { 
      isVerified: true,
      password: hashedPassword 
    },
    create: {
      email: 'admin@moodtravel.com',
      password: hashedPassword,
      name: 'MoodTravel Admin',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&q=80',
      isVerified: true,
    },
  });

  // Verify all existing users for development convenience
  await prisma.user.updateMany({
    where: {},
    data: { isVerified: true }
  });

  console.log('Admin account created/updated and all users verified.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
