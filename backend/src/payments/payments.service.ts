import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { VNPay, ProductCode, VnpLocale } from 'vnpay';

@Injectable()
export class PaymentsService {
  private vnpay: VNPay;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    this.vnpay = new VNPay({
      tmnCode: this.configService.get<string>('VNP_TMNCODE') || '',
      secureSecret: this.configService.get<string>('VNP_HASHSECRET') || '',
      vnpayHost: this.configService.get<string>('VNP_URL')?.replace('/vpcpay.html', '') || 'https://sandbox.vnpayment.vn',
      testMode: true,
    });
  }

  async createVNPayUrl(bookingId: string, ipAddr: string, origin: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new BadRequestException('Booking not found');

    const returnUrl = this.configService.get<string>('VNP_RETURNURL') || `${origin}/success`;
    const date = new Date();
    const createDate = this.formatDate(date);
    const orderId = booking.shortId.replace(/[^a-zA-Z0-9]/g, '') + createDate;

    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(Number(booking.totalAmount)),
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan don hang ' + booking.shortId,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: Number(createDate),
    });

    console.log('--- VNPAY DEBUG (Library) ---');
    console.log('Payment URL:', paymentUrl);
    console.log('-----------------------------');

    // Create a pending Payment record
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        provider: 'VNPAY',
        method: 'VNPAY',
        status: 'PENDING',
        transactionId: orderId,
      }
    });

    return { paymentUrl };
  }

  async verifyVNPayReturn(query: any) {
    const isValid = this.vnpay.verifyReturnUrl(query);

    if (isValid) {
      const orderId = query['vnp_TxnRef'];
      const rspCode = query['vnp_ResponseCode'];
      
      const payment = await this.prisma.payment.findUnique({ where: { transactionId: orderId } });
      
      if (payment) {
        if (rspCode === '00') {
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'SUCCESS' }
          });
          await this.prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'CONFIRMED', paymentStatus: 'PAID' }
          });
          return { code: '00', message: 'Success', bookingId: payment.bookingId };
        } else {
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' }
          });
          await this.prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: 'FAILED' }
          });
          return { code: rspCode, message: 'Payment failed', bookingId: payment.bookingId };
        }
      }
    } else {
      throw new BadRequestException('Invalid signature');
    }
  }

  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }
}
