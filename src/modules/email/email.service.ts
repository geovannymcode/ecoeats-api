import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.getOrThrow<string>('resend.apiKey'));
    const fromName = this.configService.get<string>('resend.fromName', 'EcoEats');
    const fromEmail = this.configService.get<string>('resend.fromEmail', 'noreply@budaso.resend.app');
    this.from = `${fromName} <${fromEmail}>`;
  }

  async sendPasswordResetOtp(to: string, otp: string): Promise<void> {
    this.logger.log(`Sending password reset OTP to: ${to}`);

    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'EcoEats - Código de recuperación de contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #2d6a4f;">EcoEats</h2>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Tu código de verificación es:</p>
            <div style="background: #f0f0f0; padding: 16px; text-align: center; border-radius: 8px; margin: 16px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d6a4f;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">Este código expira en 15 minutos. Si no solicitaste este cambio, ignora este correo.</p>
          </div>
        `,
      });

      this.logger.log(`Password reset OTP sent successfully to: ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${to}`, error);
      throw error;
    }
  }
}
