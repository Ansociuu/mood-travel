import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Fetching coupons...');
    const coupons = await prisma.coupon.findMany();
    console.log('Coupons:', coupons);
  } catch (e) {
    console.error('Error fetching coupons:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
