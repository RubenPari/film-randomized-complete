import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import helmet from 'helmet';

export async function createTestApp(
  moduleFixture: TestingModule,
): Promise<INestApplication> {
  const app = moduleFixture.createNestApplication();
  const config = app.get(ConfigService);

  app.use(helmet());
  app.setGlobalPrefix('api');

  const frontendUrl = config.get<string>('FRONTEND_URL');
  const corsOrigins = frontendUrl
    ? frontendUrl
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean)
    : ['http://localhost:5173'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  return app;
}
