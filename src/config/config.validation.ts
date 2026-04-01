import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  // Database — se acepta DATABASE_URL (Railway) o las variables individuales
  DATABASE_URL: Joi.string().optional(),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_NAME: Joi.string().default('ecoeats'),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('24h'),

  // Resend (email)
  RESEND_API_KEY: Joi.string().required(),
  RESEND_FROM_EMAIL: Joi.string().default('noreply@budaso.resend.app'),
  RESEND_FROM_NAME: Joi.string().default('EcoEats'),

  // CORS
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),
});
