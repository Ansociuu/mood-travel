import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { bookingId, rating, comment, images, hotelId, tourId } = createReviewDto;

    // Check if booking exists and belongs to user
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new BadRequestException('Booking not found or does not belong to you');
    }

    // Check if already reviewed
    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    return this.prisma.review.create({
      data: {
        userId,
        bookingId,
        rating,
        comment,
        images,
        hotelId: hotelId || booking.hotelId,
        tourId: tourId || booking.tourId,
      },
    });
  }

  async findMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        hotel: { select: { name: true, images: true } },
        tour: { select: { name: true, images: true } },
        booking: { select: { shortId: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByHotel(hotelId: string) {
    return this.prisma.review.findMany({
      where: { hotelId },
      include: {
        user: { select: { name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTour(tourId: string) {
    return this.prisma.review.findMany({
      where: { tourId },
      include: {
        user: { select: { name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOwnerReviews(ownerId: string, role: string = 'USER') {
    const where: any = {};
    if (role !== 'ADMIN') {
      where.OR = [
        { hotel: { ownerId } },
        { tour: { ownerId } }
      ];
    }

    return this.prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, avatar: true, email: true } },
        hotel: { select: { name: true } },
        tour: { select: { name: true } },
        booking: { select: { shortId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reply(id: string, reply: string, ownerId: string, role: string = 'USER') {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { 
        hotel: true, 
        tour: true 
      }
    });

    if (!review) {
      throw new BadRequestException('Đánh giá không tồn tại');
    }

    // Verify ownership or Admin
    const isOwner = (review.hotel && review.hotel.ownerId === ownerId) || 
                    (review.tour && review.tour.ownerId === ownerId);

    if (!isOwner && role !== 'ADMIN') {
      throw new BadRequestException('Bạn không có quyền phản hồi đánh giá này');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        reply,
        repliedAt: new Date(),
      }
    });
  }
}
