import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: any, @Request() req) {
    return this.toursService.create(data, req.user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyTours(@Request() req) {
    return this.toursService.findAll({ ownerId: req.user.sub });
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
    return this.toursService.update(id, data, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.toursService.remove(id, req.user.sub);
  }
}
