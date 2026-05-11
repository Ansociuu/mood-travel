import { PrismaClient, Role, HotelType, BookingStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('--- BẮT ĐẦU QUY TRÌNH NẠP DỮ LIỆU TỔNG THỂ (MASTER SEED - OPTIMIZED) ---');

  // 1. Dọn dẹp toàn bộ dữ liệu cũ
  console.log('1. Đang dọn dẹp dữ liệu cũ...');
  const tables = [
    'review', 'payment', 'bookingTour', 'bookingRoom', 'booking',
    'roomAvailability', 'tourAvailability', 'tourItinerary',
    'roomAmenity', 'hotelAmenity', 'room', 'hotel', 'tour',
    'coupon', 'wishlist', 'session', 'verificationToken', 'user', 'amenity'
  ];
  
  for (const table of tables) {
    await (prisma as any)[table].deleteMany();
  }

  console.log('2. Đang tạo Tiện nghi (Amenities)...');
  const commonAmenities = [
    { name: 'Wifi miễn phí', icon: 'Wifi' }, { name: 'Hồ bơi', icon: 'Waves' },
    { name: 'Bãi đậu xe', icon: 'Car' }, { name: 'Điều hòa', icon: 'Wind' },
    { name: 'Tivi', icon: 'Tv' }, { name: 'Bếp', icon: 'Coffee' },
    { name: 'Máy giặt', icon: 'Shirt' }, { name: 'Sân vườn', icon: 'Trees' },
    { name: 'Gym', icon: 'Dumbbell' }, { name: 'Spa', icon: 'Sparkles' }
  ];
  
  await prisma.amenity.createMany({ data: commonAmenities });
  const allAmenities = await prisma.amenity.findMany();
  const amenityIds = allAmenities.map(a => a.id);

  console.log('3. Đang tạo Tài khoản (Users)...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  // Create Admin
  await prisma.user.create({
    data: { email: 'admin@moodtravel.com', password: hashedPassword, name: 'System Admin', role: Role.ADMIN, isVerified: true }
  });

  // Create Owners & Customers in bulk
  const ownerData: any[] = [];
  for (let i = 1; i <= 5; i++) {
    ownerData.push({ email: `owner${i}@example.com`, password: hashedPassword, name: `Chủ nhà ${i}`, role: Role.OWNER, isVerified: true });
  }
  await prisma.user.createMany({ data: ownerData });
  
  const customerData: any[] = [];
  for (let i = 1; i <= 10; i++) {
    customerData.push({ email: `user${i}@example.com`, password: hashedPassword, name: `Khách hàng ${i}`, role: Role.USER, isVerified: true });
  }
  await prisma.user.createMany({ data: customerData });

  const allOwners = await prisma.user.findMany({ where: { role: Role.OWNER } });
  const allCustomers = await prisma.user.findMany({ where: { role: Role.USER } });

  console.log('4. Đang tạo Homestays & Khách sạn (20 địa điểm)...');
  const cities = ['Hà Nội', 'Đà Nẵng', 'Hội An', 'Đà Lạt', 'Phú Quốc', 'Sapa', 'Huế', 'Nha Trang', 'Hạ Long', 'Ninh Bình'];
  const hotelTypes = [HotelType.HOTEL, HotelType.HOMESTAY, HotelType.RESORT, HotelType.VILLA];
  
  const availabilityData: any[] = [];
  const hotelAmenityData: any[] = [];

  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const type = hotelTypes[i % hotelTypes.length];
    const owner = allOwners[i % allOwners.length];
    
    const hotel = await prisma.hotel.create({
      data: {
        name: `${type === HotelType.HOMESTAY ? 'Mây' : 'Viet'} ${city} ${i+1}`,
        description: `Trải nghiệm nghỉ dưỡng tuyệt vời tại ${city}.`,
        address: `${i+100} Phố cổ, ${city}`,
        city: city,
        country: 'Việt Nam',
        rating: Math.round((4.2 + (Math.random() * 0.7)) * 10) / 10,
        type: type,
        ownerId: owner.id,
        moodTags: ['Relaxed', 'Peaceful', 'Happy'],
        images: [`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800`]
      }
    });

    // Add Amenities to Hotel
    for (let j = 0; j < 5; j++) {
      hotelAmenityData.push({ hotelId: hotel.id, amenityId: amenityIds[j] });
    }

    // Add 2 rooms
    for (let r = 0; r < 2; r++) {
      const room = await prisma.room.create({
        data: {
          hotelId: hotel.id,
          name: r === 0 ? 'Standard Room' : 'Deluxe View',
          basePrice: Math.round(600000 + (Math.random() * 1500000)),
          capacity: 2 + (r * 2),
          totalRooms: 10
        }
      });

      // Prepare availability for 30 days
      const startDate = new Date();
      for (let d = 0; d < 30; d++) {
        const date = new Date();
        date.setDate(startDate.getDate() + d);
        date.setHours(0,0,0,0);
        availabilityData.push({ roomId: room.id, date, price: room.basePrice, available: 10, booked: 0 });
      }
    }
  }

  // Bulk insert availability & amenities
  console.log(`- Đang nạp ${availabilityData.length} bản ghi tình trạng phòng...`);
  await prisma.roomAvailability.createMany({ data: availabilityData });
  await (prisma as any).hotelAmenity.createMany({ data: hotelAmenityData });

  console.log('5. Đang tạo Tours (20 tour)...');
  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const owner = allOwners[i % allOwners.length];
    
    const tour = await prisma.tour.create({
      data: {
        name: `Khám phá ${city} trọn gói ${i+1}`,
        description: `Tour đặc sắc tại ${city}.`,
        location: city,
        durationDays: 3, durationNights: 2,
        basePrice: Math.round(1500000 + (Math.random() * 3000000)),
        ownerId: owner.id,
        moodTags: ['Adventurous', 'Happy'],
        images: [`https://images.unsplash.com/photo-1528127269322-539801943592?w=800`],
        includes: ['Ăn uống', 'Di chuyển'],
        excludes: ['Mua sắm']
      }
    });

    const tourAvail: any[] = [];
    for (let s = 0; s < 5; s++) {
      const date = new Date();
      date.setDate(date.getDate() + 7 + (s * 7));
      tourAvail.push({ tourId: tour.id, startDate: date, price: tour.basePrice, capacity: 20, available: 20, booked: 0 });
    }
    await prisma.tourAvailability.createMany({ data: tourAvail });
  }

  console.log('6. Đang tạo Đơn hàng & Đánh giá mẫu (Trải dài 6 tháng)...');
  const bookingData: any[] = [];
  for (let i = 0; i < 60; i++) {
    const customer = allCustomers[i % allCustomers.length];
    const hotel = await prisma.hotel.findFirst({ skip: i % 10 });
    if (!hotel) continue;
    
    // Spread over last 180 days
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - (i * 3)); 
    
    const checkIn = new Date(createdAt);
    checkIn.setDate(checkIn.getDate() + 5);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);

    const isPast = checkOut < new Date();

    await prisma.booking.create({
      data: {
        shortId: `MT-BOK${i}`,
        userId: customer.id,
        hotelId: hotel.id,
        checkIn, checkOut,
        totalAmount: 1000000 + (Math.random() * 2000000),
        status: isPast ? BookingStatus.COMPLETED : BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        guestName: customer.name!,
        guestEmail: customer.email,
        guestPhone: '0901234567',
        createdAt: createdAt,
        review: isPast ? {
          create: {
            userId: customer.id,
            hotelId: hotel.id,
            rating: 4 + Math.round(Math.random()), // 4 or 5 stars
            comment: 'Dịch vụ rất tốt, tôi rất hài lòng với chuyến đi này!'
          }
        } : undefined
      }
    });
  }

  console.log('7. Đang tạo Khuyến mãi...');
  await prisma.coupon.createMany({
    data: [
      { code: 'VIETJOURNEY', discountType: 'PERCENTAGE', value: 15, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31') },
      { code: 'HOTDEAL', discountType: 'FIXED_AMOUNT', value: 100000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31') }
    ]
  });

  console.log('8. Cập nhật điểm đánh giá trung bình...');
  const hotels = await prisma.hotel.findMany({ select: { id: true } });
  for (const h of hotels) {
    const avg = await prisma.review.aggregate({
      where: { hotelId: h.id },
      _avg: { rating: true }
    });
    if (avg._avg.rating) {
      await prisma.hotel.update({
        where: { id: h.id },
        data: { rating: Math.round(avg._avg.rating * 10) / 10 }
      });
    }
  }

  const tours = await prisma.tour.findMany({ select: { id: true } });
  for (const t of tours) {
    const avg = await prisma.review.aggregate({
      where: { tourId: t.id },
      _avg: { rating: true }
    });
    if (avg._avg.rating) {
      await prisma.tour.update({
        where: { id: t.id },
        data: { rating: Math.round(avg._avg.rating * 10) / 10 }
      });
    }
  }

  console.log('--- TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC NẠP THÀNH CÔNG! ---');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
