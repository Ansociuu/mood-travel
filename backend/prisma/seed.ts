import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Create Amenities
  const amenityList = [
    { name: 'Wifi', icon: 'wifi' },
    { name: 'Hồ bơi', icon: 'pool' },
    { name: 'Điều hòa', icon: 'ac' },
    { name: 'Bãi đậu xe', icon: 'parking' },
    { name: 'Bữa sáng', icon: 'breakfast' },
  ];

  const createdAmenities: Record<string, string> = {};
  for (const item of amenityList) {
    const amenity = await prisma.amenity.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
    createdAmenities[item.name] = amenity.id;
  }

  // 2. Create an Admin/Owner user
  const owner = await prisma.user.upsert({
    where: { email: 'admin@moodtravel.com' },
    update: {},
    create: {
      email: 'admin@moodtravel.com',
      password: 'hashed_password_here', 
      name: 'MoodTravel Admin',
      role: 'ADMIN',
    },
  });

  // 3. Create Sample Hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: 'Mood Homestay Sapa',
      description: 'Một homestay tuyệt đẹp giữa lòng Sapa với view núi Fansipan.',
      address: '01 Cầu Mây, Sapa',
      city: 'Sapa',
      country: 'Vietnam',
      type: 'HOMESTAY',
      rating: 4.8,
      ownerId: owner.id,
      images: ['https://images.unsplash.com/photo-1502784444187-359ac186c5bb'],
    },
  });

  // 4. Create Hotel Amenities (Explicitly)
  await (prisma as any).hotelAmenity.createMany({
    data: [
      { hotelId: hotel.id, amenityId: createdAmenities['Wifi'] },
      { hotelId: hotel.id, amenityId: createdAmenities['Bữa sáng'] },
    ]
  });

  // 5. Create Rooms for the hotel
  const room = await prisma.room.create({
    data: {
      hotelId: hotel.id,
      name: 'Phòng Deluxe View Núi',
      basePrice: 1200000,
      capacity: 2,
      totalRooms: 5,
    },
  });

  // 6. Create Room Amenities
  await (prisma as any).roomAmenity.create({
    data: {
      roomId: room.id,
      amenityId: createdAmenities['Điều hòa']
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
