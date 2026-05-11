import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  durationDays: number;

  @IsNumber()
  @IsNotEmpty()
  durationNights: number;

  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  moodTags?: string[];

  @IsArray()
  @IsOptional()
  itineraries?: any[];

  @IsArray()
  @IsOptional()
  availability?: any[];
}

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { location, maxPrice, minDuration, ownerId } = query;
    const where: any = {};
    
    if (location) {
      where.location = { contains: location };
    }
    if (maxPrice) {
      where.basePrice = { lte: parseFloat(maxPrice) };
    }
    if (minDuration) {
      where.durationDays = { gte: parseInt(minDuration) };
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }

    const tours = await this.prisma.tour.findMany({
      where,
      include: {
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return tours.map(tour => {
      const avgRating = tour.reviews.length > 0 
        ? tour.reviews.reduce((acc, curr) => acc + curr.rating, 0) / tour.reviews.length 
        : 0;
      return {
        ...tour,
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: tour.reviews.length
      };
    });
  }

  async findOne(id: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: {
        itineraries: {
          orderBy: { dayNumber: 'asc' }
        },
        availability: {
          where: {
            startDate: { gte: new Date() }
          },
          orderBy: { startDate: 'asc' }
        },
        owner: {
          select: { name: true, email: true, avatar: true }
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour này');
    }
    
    const avgRating = tour.reviews.length > 0 
      ? tour.reviews.reduce((acc, curr) => acc + curr.rating, 0) / tour.reviews.length 
      : 0;
      
    return {
      ...tour,
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: tour.reviews.length
    };
  }

  async create(data: any, ownerId: string) {
    const { itineraries, availability, ...tourData } = data;
    
    return this.prisma.tour.create({
      data: {
        ...tourData,
        ownerId,
        itineraries: itineraries ? {
          create: itineraries.map(item => ({
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
            image: item.image
          }))
        } : undefined,
        availability: availability ? {
          create: availability.map(item => ({
            startDate: new Date(item.startDate),
            price: item.price,
            capacity: item.capacity,
            available: item.capacity
          }))
        } : undefined
      }
    });
  }

  async update(id: string, data: any, user: { id: string; role: string }) {
    const tour = await this.prisma.tour.findUnique({ where: { id } });
    if (!tour) throw new NotFoundException('Không tìm thấy tour này');
    
    if (tour.ownerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa tour này');
    }

    const { 
      id: _id, 
      ownerId: _ownerId, 
      createdAt: _createdAt, 
      updatedAt: _updatedAt, 
      owner: _owner, 
      reviews: _reviews, 
      rating: _rating,
      reviewCount: _reviewCount,
      wishlists: _wishlists,
      bookingTours: _bookingTours,
      bookings: _bookings,
      itineraries, 
      availability, 
      ...tourData 
    } = data;

    // Handle nested updates by deleting and recreating
    // (This is a simpler approach for nested relations in Prisma)
    return this.prisma.tour.update({
      where: { id },
      data: {
        ...tourData,
        itineraries: itineraries ? {
          deleteMany: {},
          create: itineraries.map(item => ({
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
            image: item.image
          }))
        } : undefined,
        availability: availability ? {
          deleteMany: {},
          create: availability.map(item => ({
            startDate: new Date(item.startDate),
            price: item.price,
            capacity: item.capacity,
            available: item.capacity
          }))
        } : undefined
      },
    });
  }

  async remove(id: string, user: { id: string; role: string }) {
    const tour = await this.prisma.tour.findUnique({ where: { id } });
    if (!tour) throw new NotFoundException('Không tìm thấy tour này');
    
    if (tour.ownerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa tour này');
    }
    return this.prisma.tour.delete({ where: { id } });
  }
}
