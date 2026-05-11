import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getRecommendationsByMood(mood: string) {
    // Fetch tours with the matching mood
    const tours = await this.prisma.tour.findMany({
      where: {
        moodTags: {
          array_contains: mood,
        },
      },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
      take: 4,
    });

    // Fetch hotels with the matching mood
    const hotels = await this.prisma.hotel.findMany({
      where: {
        moodTags: {
          array_contains: mood,
        },
      },
      include: {
        reviews: {
          select: { rating: true },
        },
        rooms: {
          select: { 
            basePrice: true,
            capacity: true,
          },
        },
      },
      take: 4,
    });

    return {
      tours: tours.map(tour => {
        const avgRating = tour.reviews.length > 0 
          ? tour.reviews.reduce((acc, curr) => acc + curr.rating, 0) / tour.reviews.length 
          : (tour as any).rating || 0;
          
        return {
          ...tour,
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: tour.reviews.length
        };
      }),
      hotels: hotels.map(hotel => {
        // Calculate min price from rooms
        const minPrice = hotel.rooms.length > 0
          ? Math.min(...hotel.rooms.map(r => Number(r.basePrice)))
          : 0;
          
        const avgRating = hotel.reviews.length > 0 
          ? hotel.reviews.reduce((acc, curr) => acc + curr.rating, 0) / hotel.reviews.length 
          : (hotel as any).rating || 0;
          
        return {
          ...hotel,
          price: minPrice,
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: hotel.reviews.length,
          guests: hotel.rooms.length > 0 ? Math.max(...hotel.rooms.map(r => r.capacity)) : 2
        };
      }),
    };
  }
}
