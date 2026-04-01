import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import resendConfig from './config/resend.config';
import { configValidationSchema } from './config/config.validation';

import { AuthModule } from './modules/auth/auth.module';
import { DishesModule } from './modules/dishes/dishes.module';
import { HealthModule } from './modules/health/health.module';
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [
    // ─── Configuration ──────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, resendConfig],
      validationSchema: configValidationSchema,
      validationOptions: { abortEarly: true },
    }),

    // ─── Database ───────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('database.url');

        // Railway inyecta DATABASE_URL; en local usamos variables individuales
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            ssl:
              databaseUrl.includes('railway.app') || databaseUrl.includes('neon.tech')
                ? { rejectUnauthorized: false }
                : false,
            autoLoadEntities: true,
            synchronize: configService.get<string>('app.environment') !== 'production',
            logging: configService.get<string>('app.environment') === 'development',
          };
        }

        return {
          type: 'postgres' as const,
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          database: configService.get<string>('database.name'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          autoLoadEntities: true,
          synchronize: configService.get<string>('app.environment') !== 'production',
          logging: configService.get<string>('app.environment') === 'development',
        };
      },
    }),

    // ─── Rate Limiting ──────────────────────────────────────────
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // ─── Feature Modules ────────────────────────────────────────
    AuthModule,
    DishesModule,
    HealthModule,
    SeedModule,
  ],
})
export class AppModule {}
