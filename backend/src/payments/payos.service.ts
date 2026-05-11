import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PayOS } from '@payos/node';

@Injectable()
export class PayosService {
  private payos: PayOS;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    this.payos = new PayOS({
      clientId: this.configService.get<string>('PAYOS_CLIENT_ID') || '',
      apiKey: this.configService.get<string>('PAYOS_API_KEY') || '',
      checksumKey: this.configService.get<string>('PAYOS_CHECKSUM_KEY') || '',
    });
  }

  async createPaymentLink(bookingId: string, origin: string) {
    const booking = await this.prisma.booking.findUnique({ 
      where: { id: bookingId },
      include: { tour: true } 
    });
    if (!booking) throw new BadRequestException('Booking not found');

    const orderCode = Number(String(Date.now()).slice(-9)); // PayOS expects numeric orderCode
    const amount = Math.round(Number(booking.totalAmount));
    const description = `MoodTravel MT-${booking.shortId}`.slice(0, 25); // Max 25 chars

    const body = {
      orderCode: orderCode,
      amount: amount,
      description: description,
      items: [
        {
          name: booking.tour?.name || 'Tour Booking',
          quantity: 1,
          price: amount,
        },
      ],
      returnUrl: `${origin}/success`,
      cancelUrl: `${origin}/checkout`,
    };

    try {
      const paymentLinkRes = await this.payos.paymentRequests.create(body);
      
      // Create a pending Payment record
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          provider: 'PAYOS',
          method: 'BANK_TRANSFER',
          status: 'PENDING',
          transactionId: String(orderCode),
        }
      });

      return { paymentUrl: paymentLinkRes.checkoutUrl };
    } catch (error) {
      console.error('PayOS Error:', error);
      throw new BadRequestException('Failed to create PayOS payment link');
    }
  }

  async handleWebhook(webhookData: any) {
    // Note: In production, you MUST verify the webhook signature using this.payos.verifyPaymentWebhookData(webhookData)
    const { orderCode, code } = webhookData;

    if (code === '00') {
      const payment = await this.prisma.payment.findUnique({ 
        where: { transactionId: String(orderCode) } 
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS' }
        });
        await this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED', paymentStatus: 'PAID' }
        });
      }
    }
    
    return { success: true };
  }
}
