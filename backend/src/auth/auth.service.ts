import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    const user = await this.usersService.create(dto);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.verificationToken.create({
      data: {
        token: otp,
        email: user.email,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
      },
    });

    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, user.name || 'Khách hàng', otp);

    return {
      message: 'Mã xác thực đã được gửi tới email của bạn.',
      email: user.email,
    };
  }

  async verifyEmail(email: string, token: string) {
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        email,
        token,
        type: 'EMAIL_VERIFICATION',
      },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã hết hạn');
    }

    await this.prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Send welcome email after successful verification
    this.mailService.sendWelcomeEmail(user.email, user.name || 'Khách hàng');
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Tài khoản của bạn chưa được xác thực email.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('Không có thông tin từ Google');
    }

    const { email, name, picture } = req.user;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Create new user for social login
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          avatar: picture,
          password: '', // Social users don't have a local password initially
          isVerified: true, // Social accounts are trusted
        },
      });
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async facebookLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('Không có thông tin từ Facebook');
    }

    const { email, firstName, lastName } = req.user;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          password: '',
          isVerified: true,
        },
      });
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
