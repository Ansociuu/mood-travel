import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Chào mừng bạn đến với MoodTravel! ✈️',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 12px;">
            <h2 style="color: #0d9488;">Chào mừng ${name}!</h2>
            <p>Cảm ơn bạn đã gia nhập cộng đồng MoodTravel - Nền tảng khám phá và đặt phòng homestay hàng đầu.</p>
            <p>Để chào mừng bạn, chúng tôi tặng bạn mã giảm giá <b>MOOD200</b> trị giá <b>200.000₫</b> cho chuyến đi đầu tiên.</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 20px; font-weight: bold; color: #0f172a;">Mã của bạn: MOOD200</span>
            </div>
            <p>Hãy bắt đầu khám phá những địa điểm tuyệt vời ngay hôm nay!</p>
            <a href="http://localhost:3000" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Khám phá ngay</a>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <p style="font-size: 12px; color: #64748b;">Đây là email tự động, vui lòng không trả lời. © 2026 MoodTravel Team.</p>
          </div>
        `,
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendVerificationEmail(email: string, name: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Mã xác thực tài khoản MoodTravel của bạn 🛡️',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0d9488;">Xác thực tài khoản</h2>
            <p>Chào ${name},</p>
            <p>Cảm ơn bạn đã đăng ký tại MoodTravel. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình xác thực tài khoản của bạn:</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <span style="font-size: 32px; font-weight: 800; color: #0d9488; letter-spacing: 5px;">${otp}</span>
            </div>
            <p>Mã này sẽ hết hạn trong vòng <b>10 phút</b>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <p style="font-size: 12px; color: #64748b;">© 2026 MoodTravel Team. Bảo mật là ưu tiên hàng đầu của chúng tôi.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }

  async sendResetPasswordEmail(email: string, name: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Yêu cầu khôi phục mật khẩu MoodTravel 🔑',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0d9488;">Khôi phục mật khẩu</h2>
            <p>Chào ${name},</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác nhận dưới đây để tiếp tục:</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <span style="font-size: 32px; font-weight: 800; color: #f43f5e; letter-spacing: 5px;">${otp}</span>
            </div>
            <p>Mã này sẽ hết hạn trong vòng <b>10 phút</b>. Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này và đổi mật khẩu hiện tại để đảm bảo an toàn.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <p style="font-size: 12px; color: #64748b;">© 2026 MoodTravel Team. Bảo mật là ưu tiên hàng đầu của chúng tôi.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send reset password email:', error);
    }
  }
}
