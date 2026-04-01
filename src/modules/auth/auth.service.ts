import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity } from './entities/user.entity';
import { PasswordResetTokenEntity } from './entities/password-reset-token.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private static readonly OTP_EXPIRATION_MINUTES = 15;
  private static readonly SALT_ROUNDS = 10;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly resetTokenRepository: Repository<PasswordResetTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    this.logger.log(`Register attempt for: ${dto.correo}`);

    const existing = await this.userRepository.findOne({ where: { email: dto.correo } });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, AuthService.SALT_ROUNDS);

    const user = this.userRepository.create({
      numeroDocumento: dto.numero_documento,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      email: dto.correo,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(user);

    this.logger.log(`Register successful: ${saved.email}`);

    return {
      user: {
        id: saved.id,
        numero_documento: saved.numeroDocumento,
        nombres: saved.nombres,
        apellidos: saved.apellidos,
        correo: saved.email,
      },
    };
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for: ${dto.email}`);

    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'tokenFirebaseAuth'],
    });

    if (!user) {
      this.logger.warn(`Login failed — user not found: ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed — invalid password: ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Login successful: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      token,
      tokenFirebaseAuth: user.tokenFirebaseAuth,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    this.logger.log(`Forgot password request for: ${dto.email}`);

    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      this.logger.warn(`Forgot password — user not found: ${dto.email}`);
      throw new NotFoundException('No se encontró un usuario con ese email');
    }

    // Invalidate any previous unused tokens for this user
    await this.resetTokenRepository.update(
      { userId: user.id, used: false },
      { used: true },
    );

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + AuthService.OTP_EXPIRATION_MINUTES * 60 * 1000);

    const resetToken = this.resetTokenRepository.create({
      otp,
      userId: user.id,
      expiresAt,
    });
    await this.resetTokenRepository.save(resetToken);

    await this.emailService.sendPasswordResetOtp(user.email, otp);

    this.logger.log(`OTP sent to: ${user.email}`);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    this.logger.log(`Verify OTP for: ${dto.email}`);

    const token = await this.findValidResetToken(dto.email, dto.otp);
    return { valid: !!token };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    this.logger.log(`Reset password for: ${dto.email}`);

    const token = await this.findValidResetToken(dto.email, dto.otp);
    if (!token) {
      throw new BadRequestException('OTP inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, AuthService.SALT_ROUNDS);
    await this.userRepository.update({ id: token.userId }, { password: hashedPassword });

    token.used = true;
    await this.resetTokenRepository.save(token);

    this.logger.log(`Password reset successful for: ${dto.email}`);
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async findValidResetToken(
    email: string,
    otp: string,
  ): Promise<PasswordResetTokenEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    return this.resetTokenRepository.findOne({
      where: {
        userId: user.id,
        otp,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
    });
  }
}
