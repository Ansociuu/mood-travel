import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.OWNER)
  @Get('stats')
  @ApiOperation({ summary: 'Lấy thông tin thống kê cho Admin/Owner' })
  getStats(@Request() req) {
    return this.adminService.getStats(req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.OWNER)
  @Get('finance')
  @ApiOperation({ summary: 'Lấy báo cáo tài chính' })
  getFinance(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getFinanceData(req.user, startDate, endDate);
  }
}
