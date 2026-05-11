import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('mood')
  async getByMood(@Query('mood') mood: string) {
    if (!mood) {
      return { tours: [], hotels: [] };
    }
    return this.recommendationsService.getRecommendationsByMood(mood);
  }
}
