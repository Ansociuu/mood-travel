import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PrismaService } from '../prisma/prisma.service';
import { HotelType } from '@prisma/client';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsEnum(HotelType)
  @IsOptional()
  type?: HotelType;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsOptional()
  policies?: any;

  @IsArray()
  @IsOptional()
  moodTags?: string[];

  @IsArray()
  @IsOptional()
  rooms?: any[];

  @IsArray()
  @IsOptional()
  amenities?: any[];
}

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto, ownerId: string) {
    const { rooms, amenities, ...hotelData } = createHotelDto as any;
    return this.prisma.hotel.create({
      data: {
        ...hotelData,
        ownerId,
        rooms: rooms?.length ? {
          create: rooms.map((room: any) => ({
            name: room.name,
            description: room.description || null,
            type: room.type || null,
            basePrice: room.basePrice,
            capacity: room.capacity ?? 2,
            totalRooms: room.totalRooms ?? 1,
            images: room.images || null,
          }))
        } : undefined,
      },
    });
  }

  async findAll(query: any) {
    const { city, type, ownerId } = query;
    const where: any = {};
    
    if (city) {
      where.city = { contains: city };
    }
    if (type) {
      where.type = type;
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }

    return this.prisma.hotel.findMany({
      where,
      include: {
        amenities: {
          include: {
            amenity: true
          }
        },
        rooms: {
          select: {
            id: true,
            name: true,
            basePrice: true,
            totalRooms: true,
          },
          orderBy: {
            basePrice: 'asc'
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        amenities: {
          include: {
            amenity: true
          }
        },
        rooms: {
          include: {
            availability: true,
            amenities: {
              include: {
                amenity: true
              }
            }
          }
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

    if (!hotel) {
      throw new NotFoundException('Không tìm thấy cơ sở lưu trú này');
    }
    return hotel;
  }

  async update(id: string, updateData: any, user: { id: string; role: string }) {
    const hotel = await this.findOne(id);
    if (hotel.ownerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa cơ sở này');
    }

    const { 
      id: _id, 
      ownerId: _ownerId, 
      createdAt: _createdAt, 
      updatedAt: _updatedAt, 
      owner: _owner, 
      reviews: _reviews, 
      rooms, 
      amenities, 
      ...hotelData 
    } = updateData;

    return this.prisma.hotel.update({
      where: { id },
      data: {
        ...hotelData,
        rooms: rooms ? {
          deleteMany: {},
          create: rooms.map(room => ({
            name: room.name,
            description: room.description,
            type: room.type,
            basePrice: room.basePrice,
            capacity: room.capacity,
            totalRooms: room.totalRooms,
            images: room.images
          }))
        } : undefined,
      },
    });
  }

  async remove(id: string, user: { id: string; role: string }) {
    const hotel = await this.findOne(id);
    if (hotel.ownerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa cơ sở này');
    }

    return this.prisma.hotel.delete({
      where: { id },
    });
  }

  async bulkUpdateInventory(id: string, data: any, userId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: { rooms: true }
    });

    if (!hotel) throw new NotFoundException('Không tìm thấy cơ sở');
    if (hotel.ownerId !== userId) throw new ForbiddenException('Bạn không có quyền');

    const { startDate, endDate, price, status, roomId } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const roomsToUpdate = roomId === 'ALL' ? hotel.rooms : hotel.rooms.filter(r => r.id === roomId);

    for (const room of roomsToUpdate) {
      // Loop through each day in range
      const current = new Date(start);
      while (current < end) {
        await this.prisma.roomAvailability.upsert({
          where: {
            roomId_date: {
              roomId: room.id,
              date: new Date(current)
            }
          },
          update: {
            price: price ? parseFloat(price) : undefined,
            available: status === 'OPEN' ? (room.totalRooms || 1) : 0
          },
          create: {
            roomId: room.id,
            date: new Date(current),
            price: price ? parseFloat(price) : room.basePrice,
            available: status === 'OPEN' ? (room.totalRooms || 1) : 0
          }
        });
        current.setDate(current.getDate() + 1);
      }
    }

    return { success: true };
  }
}
