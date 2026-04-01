import { registerAs } from '@nestjs/config';

export default registerAs('resend', () => ({
  apiKey: process.env.RESEND_API_KEY ?? '',
  fromEmail: process.env.RESEND_FROM_EMAIL ?? 'noreply@budaso.resend.app',
  fromName: process.env.RESEND_FROM_NAME ?? 'EcoEats',
}));
