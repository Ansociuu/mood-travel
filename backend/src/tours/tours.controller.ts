import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: any, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.toursService.create(data, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyTours(@Request() req) {
    const userId = req.user.id || req.user.sub;
    const filter: any = {};
    if (req.user.role !== 'ADMIN') {
      filter.ownerId = userId;
    }
    return this.toursService.findAll(filter);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.toursService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.toursService.update(id, data, { id: userId, role: req.user.role });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.toursService.remove(id, { id: userId, role: req.user.role });
  }
}
