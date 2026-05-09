import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.ethereal.email',
        port: Number(process.env.MAIL_PORT) || 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.MAIL_USER || 'test@ethereal.email',
          pass: process.env.MAIL_PASS || 'test-pass',
        },
        tls: {
          rejectUnauthorized: false,
        },
        // Bắt buộc Node.js sử dụng IPv4 thay vì IPv6 để tránh lỗi ENETUNREACH
        family: 4,
      },
      defaults: {
        from: '"MoodTravel" <noreply@moodtravel.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
