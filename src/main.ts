import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // ─── Security ───────────────────────────────────────────────
  app.use(helmet());

  const allowedOrigins = configService.get<string[]>('app.allowedOrigins') ?? ['*'];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ─── Global Pipes ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global Filter & Interceptor ──────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ─── Swagger ───────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EcoEats API')
    .setDescription('API de comida saludable colombiana')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // ─── Graceful Shutdown ─────────────────────────────────────
  app.enableShutdownHooks();

  // ─── Start ─────────────────────────────────────────────────
  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);
  logger.log(`EcoEats API running on port ${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
