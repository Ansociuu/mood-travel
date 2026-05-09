import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu dọn dẹp dữ liệu cũ (Xóa Hotel, Room, User)...');
  await prisma.review.deleteMany();
  await prisma.roomAmenity.deleteMany();
  await prisma.hotelAmenity.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'OWNER' } });
  await prisma.amenity.deleteMany();

  console.log('Seeding dữ liệu phong phú mới...');

  // 1. Create Amenities
  const amenityList = [
    { name: 'Wifi tốc độ cao', icon: 'Wifi' },
    { name: 'Hồ bơi vô cực', icon: 'Waves' },
    { name: 'Bếp tiện nghi', icon: 'Coffee' },
    { name: 'Bãi đậu xe miễn phí', icon: 'Car' },
    { name: 'Điều hòa nhiệt độ', icon: 'Wind' },
    { name: 'Smart TV', icon: 'Tv' },
    { name: 'Lễ tân 24/7', icon: 'CheckCircle2' },
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

  // 2. Create Owners
  const hashedPassword = await bcrypt.hash('123456', 10);
  const owner1 = await prisma.user.create({
    data: {
      email: 'owner1@vietjourney.com',
      password: hashedPassword,
      name: 'Nguyễn Trường Giang',
      role: 'OWNER',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@vietjourney.com',
      password: hashedPassword,
      name: 'Trần Mai Phương',
      role: 'OWNER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    },
  });

  // 3. Create Hotels
  const hotelsData = [
    {
      name: 'Sapa Highland Eco-Lodge',
      description: 'Nằm ẩn mình giữa những thửa ruộng bậc thang tuyệt đẹp của bản Tả Van. Mang đến trải nghiệm văn hoá bản địa kết hợp với tiện nghi cao cấp. Mỗi buổi sáng bạn sẽ được đánh thức bởi tiếng chim hót và mây trôi ngoài cửa sổ.',
      address: 'Bản Tả Van, Sapa',
      city: 'Sapa',
      country: 'Việt Nam',
      lat: 22.3364,
      lng: 103.8438,
      type: 'RESORT',
      rating: 4.9,
      ownerId: owner1.id,
      images: [
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
        'https://images.unsplash.com/photo-1572791870574-8a7b7b3d2dd3?w=800&q=80'
      ],
      amenities: ['Wifi tốc độ cao', 'Bếp tiện nghi', 'Bãi đậu xe miễn phí'],
      rooms: [
        { name: 'Bungalow View Núi', basePrice: 1500000, capacity: 2, totalRooms: 10 },
        { name: 'Family Suite', basePrice: 2800000, capacity: 4, totalRooms: 3 }
      ]
    },
    {
      name: 'Hội An Lantern Villa',
      description: 'Villa mang đậm nét kiến trúc cổ kính của Hội An. Chỉ cách Chùa Cầu 5 phút đi bộ. Cung cấp xe đạp miễn phí để bạn vi vu khám phá phố cổ.',
      address: '122 Nguyễn Thái Học, Hội An',
      city: 'Hội An',
      country: 'Việt Nam',
      lat: 15.8777,
      lng: 108.3275,
      type: 'VILLA',
      rating: 4.8,
      ownerId: owner2.id,
      images: [
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80'
      ],
      amenities: ['Wifi tốc độ cao', 'Hồ bơi vô cực', 'Smart TV', 'Điều hòa nhiệt độ'],
      rooms: [
        { name: 'Phòng Cổ Điển', basePrice: 850000, capacity: 2, totalRooms: 5 },
        { name: 'Biệt Thự Nguyên Căn', basePrice: 4500000, capacity: 8, totalRooms: 1 }
      ]
    },
    {
      name: 'Đà Nẵng Ocean View',
      description: 'Khách sạn ven biển đẳng cấp quốc tế. Tất cả các phòng đều có ban công hướng biển Mỹ Khê. Thưởng thức buffet sáng chuẩn 5 sao.',
      address: 'Đường Võ Nguyên Giáp, Đà Nẵng',
      city: 'Đà Nẵng',
      country: 'Việt Nam',
      lat: 16.0664,
      lng: 108.2435,
      type: 'HOTEL',
      rating: 4.6,
      ownerId: owner1.id,
      images: [
        'https://images.unsplash.com/photo-1564596823821-79b7a0314a52?w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7def511?w=800&q=80'
      ],
      amenities: ['Wifi tốc độ cao', 'Hồ bơi vô cực', 'Lễ tân 24/7', 'Smart TV'],
      rooms: [
        { name: 'Superior Sea View', basePrice: 1200000, capacity: 2, totalRooms: 20 },
        { name: 'Presidential Suite', basePrice: 5500000, capacity: 4, totalRooms: 2 }
      ]
    },
    {
      name: 'Đà Lạt Pine Forest Retreat',
      description: 'Căn nhà gỗ lãng mạn lọt thỏm giữa rừng thông. Tách biệt hoàn toàn khỏi sự ồn ào của phố thị. Nơi lý tưởng để "chữa lành" và tổ chức tiệc BBQ ngoài trời.',
      address: 'Đường Trại Mát, Đà Lạt',
      city: 'Đà Lạt',
      country: 'Việt Nam',
      lat: 11.9404,
      lng: 108.4583,
      type: 'HOMESTAY',
      rating: 4.7,
      ownerId: owner2.id,
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
      ],
      amenities: ['Wifi tốc độ cao', 'Bếp tiện nghi', 'Bãi đậu xe miễn phí'],
      rooms: [
        { name: 'Nhà Gỗ Nhỏ', basePrice: 650000, capacity: 2, totalRooms: 8 },
        { name: 'Nhà Gỗ Lớn (Family)', basePrice: 1800000, capacity: 6, totalRooms: 4 }
      ]
    }
  ];

  for (const h of hotelsData) {
    const hotel = await prisma.hotel.create({
      data: {
        name: h.name,
        description: h.description,
        address: h.address,
        city: h.city,
        country: h.country,
        lat: h.lat,
        lng: h.lng,
        type: h.type as any,
        rating: h.rating,
        ownerId: h.ownerId,
        images: h.images,
      },
    });

    // Add Amenities
    for (const am of h.amenities) {
      await (prisma as any).hotelAmenity.create({
        data: {
          hotelId: hotel.id,
          amenityId: createdAmenities[am],
        }
      });
    }

    // Add Rooms
    for (const r of h.rooms) {
      const room = await prisma.room.create({
        data: {
          hotelId: hotel.id,
          name: r.name,
          basePrice: r.basePrice,
          capacity: r.capacity,
          totalRooms: r.totalRooms,
        }
      });

      // Assign all hotel amenities to the room for simplicity
      for (const am of h.amenities) {
        await (prisma as any).roomAmenity.create({
          data: {
            roomId: room.id,
            amenityId: createdAmenities[am],
          }
        });
      }
    }
  }

  console.log('Seed dữ liệu MỚI cực kỳ phong phú thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
