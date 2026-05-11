import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayosService } from './payos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly payosService: PayosService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('vnpay/create-url')
  createVNPayUrl(@Body() body: { bookingId: string }, @Req() req: Request) {
    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (Array.isArray(ipAddr)) ipAddr = ipAddr[0];
    if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') ipAddr = '127.0.0.1';
    
    const origin = req.headers.origin || 'http://localhost:3000';
    return this.paymentsService.createVNPayUrl(body.bookingId, ipAddr as string, origin);
  }

  @Get('vnpay/vnpay_return')
  verifyVNPayReturn(@Query() query: any) {
    return this.paymentsService.verifyVNPayReturn(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payos/create-url')
  createPayosUrl(@Body() body: { bookingId: string }, @Req() req: Request) {
    const origin = req.headers.origin || 'http://localhost:3000';
    return this.payosService.createPaymentLink(body.bookingId, origin);
  }

  @Post('payos/webhook')
  handlePayosWebhook(@Body() body: any) {
    return this.payosService.handleWebhook(body.data);
  }
}
