import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { HotelsService, CreateHotelDto } from './hotels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createHotelDto: CreateHotelDto, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.hotelsService.create(createHotelDto, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyHotels(@Request() req) {
    const userId = req.user.id || req.user.sub;
    const filter: any = {};
    if (req.user.role !== 'ADMIN') {
      filter.ownerId = userId;
    }
    return this.hotelsService.findAll(filter);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.hotelsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.hotelsService.update(id, updateData, { id: userId, role: req.user.role });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.hotelsService.remove(id, { id: userId, role: req.user.role });
  }

  @Post(':id/inventory')
  @UseGuards(JwtAuthGuard)
  bulkUpdate(@Param('id') id: string, @Body() body: any, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.hotelsService.bulkUpdateInventory(id, body, userId);
  }
}
