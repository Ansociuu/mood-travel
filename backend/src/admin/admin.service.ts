import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, BookingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats(user: { id: string, role: string }) {
    const isAdmin = user.role === Role.ADMIN;
    const isOwner = user.role === Role.OWNER;
    const ownerId = isOwner ? user.id : undefined;

    // Security Gate: If somehow a USER reaches here (RolesGuard should prevent it)
    if (!isAdmin && !isOwner) {
      return {
        revenue: 0,
        bookings: 0,
        products: 0,
        rating: "0.0",
        recentBookings: [],
        revenueGrowth: 0,
        bookingsGrowth: 0
      };
    }

    const baseWhere: any = {
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] }
    };

    if (isOwner) {
      baseWhere.OR = [
        { hotel: { ownerId: ownerId } },
        { tour: { ownerId: ownerId } }
      ];
    }

    // 1. Calculate Revenue
    const revenueStats = await this.prisma.booking.aggregate({
      where: baseWhere,
      _sum: { totalAmount: true }
    });

    // 2. Count Bookings
    const bookingsCount = await this.prisma.booking.count({
      where: baseWhere
    });

    // 3. Count Active Products
    const hotelsCount = await this.prisma.hotel.count({
      where: { ...(isOwner && { ownerId }) }
    });
    const toursCount = await this.prisma.tour.count({
      where: { ...(isOwner && { ownerId }) }
    });

    // 4. Average Rating
    const reviewStats = await this.prisma.review.aggregate({
      where: {
        ...(isOwner && {
          OR: [
            { hotel: { ownerId: ownerId } },
            { tour: { ownerId: ownerId } }
          ]
        })
      },
      _avg: { rating: true }
    });

    // 5. Recent Activity
    const recentBookings = await this.prisma.booking.findMany({
      where: {
        ...(isOwner && {
          OR: [
            { hotel: { ownerId: ownerId } },
            { tour: { ownerId: ownerId } }
          ]
        })
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        hotel: true,
        tour: true,
        user: { select: { name: true, avatar: true } }
      }
    });

    return {
      revenue: revenueStats._sum.totalAmount || 0,
      bookings: bookingsCount,
      products: hotelsCount + toursCount,
      rating: Number(reviewStats._avg.rating || 0).toFixed(1),
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        guestName: b.user?.name || b.guestName,
        productName: b.hotel?.name || b.tour?.name,
        date: b.createdAt,
        amount: b.totalAmount,
        status: b.status
      })),
      revenueGrowth: 15.2, // Mock growth for now
      bookingsGrowth: 10.5
    };
  }

  async getFinanceData(user: { id: string, role: string }, startDate?: string, endDate?: string) {
    const isOwner = user.role === 'OWNER';
    const ownerId = isOwner ? user.id : undefined;

    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
    const end = endDate ? new Date(endDate) : new Date();
    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    // 1. Monthly Revenue
    const months: { month: number, year: number, label: string, revenue: number }[] = [];
    const tempDate = new Date(start);
    while (tempDate <= end) {
      months.push({
        month: tempDate.getMonth() + 1,
        year: tempDate.getFullYear(),
        label: `Tháng ${tempDate.getMonth() + 1}`,
        revenue: 0
      });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...(isOwner && {
          OR: [
            { hotel: { ownerId } },
            { tour: { ownerId } }
          ]
        })
      },
      select: { 
        totalAmount: true, 
        createdAt: true, 
        hotelId: true, 
        tourId: true, 
        status: true 
      }
    });

    // Calculations
    let grossRevenue = 0;
    let lostRevenue = 0;
    let completedRevenue = 0;
    let pendingRevenue = 0;

    bookings.forEach(b => {
      const amount = Number(b.totalAmount);
      
      if (b.status === 'CANCELLED') {
        lostRevenue += amount;
      } else {
        grossRevenue += amount;
        
        if (b.status === 'COMPLETED') {
          completedRevenue += amount;
        } else if (b.status === 'CONFIRMED' || b.status === 'PENDING') {
          pendingRevenue += amount;
        }

        // Monthly mapping
        const date = new Date(b.createdAt);
        const m = months.find(item => item.month === date.getMonth() + 1 && item.year === date.getFullYear());
        if (m) m.revenue += amount;
      }
    });

    const COMMISSION_RATE = 0.1; // 10%
    const commission = grossRevenue * COMMISSION_RATE;
    const netRevenue = grossRevenue - commission;

    // Revenue by Category (Exclude cancelled)
    const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');
    const hotelRevenue = activeBookings.filter(b => b.hotelId).reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const tourRevenue = activeBookings.filter(b => b.tourId).reduce((sum, b) => sum + Number(b.totalAmount), 0);

    // Top Products
    const hotels = await this.prisma.hotel.findMany({
      where: { ...(isOwner && { ownerId }) },
      include: { 
        _count: { 
          select: { 
            bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: start, lte: end } } } 
          } 
        } 
      },
    });

    const tours = await this.prisma.tour.findMany({
      where: { ...(isOwner && { ownerId }) },
      include: { 
        _count: { 
          select: { 
            bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: start, lte: end } } } 
          } 
        } 
      },
    });

    const topProducts = (await Promise.all([...hotels, ...tours].map(async p => {
      const rev = await this.prisma.booking.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: { gte: start, lte: end },
          OR: [
            { hotelId: p.id },
            { tourId: p.id }
          ]
        },
        _sum: { totalAmount: true }
      });
      return {
        id: p.id,
        name: p.name,
        type: (p as any).ownerId ? 'Hotel' : 'Tour',
        bookings: (p as any)._count.bookings,
        revenue: Number(rev._sum.totalAmount || 0)
      };
    })))
      .filter(p => p.bookings > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 4. Top Owners (ADMIN ONLY)
    let topOwners: { id: string, name: string, email: string, bookings: number, revenue: number }[] = [];
    if (user.role === 'ADMIN') {
      const owners = await this.prisma.user.findMany({
        where: { role: 'OWNER' },
        select: { 
          id: true, 
          name: true, 
          email: true,
          ownedHotels: { select: { bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: start, lte: end } } } } },
          ownedTours: { select: { bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: start, lte: end } } } } }
        }
      });

      topOwners = (await Promise.all(owners.map(async o => {
        const rev = await this.prisma.booking.aggregate({
          where: {
            status: { in: ['CONFIRMED', 'COMPLETED'] },
            createdAt: { gte: start, lte: end },
            OR: [
              { hotel: { ownerId: o.id } },
              { tour: { ownerId: o.id } }
            ]
          },
          _sum: { totalAmount: true }
        });
        const hotelBookings = o.ownedHotels.reduce((sum, h) => sum + h.bookings.length, 0);
        const tourBookings = o.ownedTours.reduce((sum, t) => sum + t.bookings.length, 0);
        return {
          id: o.id,
          name: o.name || 'N/A',
          email: o.email,
          bookings: hotelBookings + tourBookings,
          revenue: Number(rev._sum.totalAmount || 0)
        };
      })))
      .filter(o => o.bookings > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    }

    return {
      stats: {
        grossRevenue,
        netRevenue,
        commission,
        lostRevenue,
        completedRevenue,
        pendingRevenue,
        bookingCount: activeBookings.length,
        cancelledCount: bookings.length - activeBookings.length
      },
      monthlyRevenue: months,
      categories: [
        { name: 'Homestays', value: hotelRevenue, color: '#0d9488' },
        { name: 'Tours', value: tourRevenue, color: '#8b5cf6' }
      ],
      topProducts,
      topOwners,
      dateRange: { start, end }
    };
  }
}
