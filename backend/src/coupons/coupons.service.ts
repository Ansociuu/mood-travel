import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundException('Mã giảm giá không hợp lệ');
    
    // Check validity
    const now = new Date();
    if (now < coupon.startDate) throw new ConflictException('Mã giảm giá chưa đến thời hạn sử dụng');
    if (now > coupon.endDate) throw new ConflictException('Mã giảm giá đã hết hạn');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new ConflictException('Mã giảm giá đã hết lượt sử dụng');
    }
    if (!coupon.isActive) throw new ConflictException('Mã giảm giá đang bị tạm dừng');

    return coupon;
  }

  async create(data: any) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException('Mã giảm giá này đã tồn tại');

    return this.prisma.coupon.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        value: parseFloat(data.value),
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
      }
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        value: data.value ? parseFloat(data.value) : undefined,
        usageLimit: data.usageLimit !== undefined ? (data.usageLimit ? parseInt(data.usageLimit) : null) : undefined,
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coupon.delete({ where: { id } });
  }
}
