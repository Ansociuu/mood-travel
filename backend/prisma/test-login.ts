import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLogin(email, password) {
  console.log(`Testing login for: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('Error: User not found');
    return;
  }
  
  console.log(`User found: ${user.email}, Role: ${user.role}, Verified: ${user.isVerified}`);
  
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`Password match: ${isMatch}`);
  
  if (!user.isVerified) {
    console.log('Error: User not verified');
  }
}

async function main() {
  await testLogin('admin@moodtravel.com', 'admin123');
  await testLogin('owner1@vietjourney.com', '123456');
}

main().finally(() => prisma.$disconnect());
