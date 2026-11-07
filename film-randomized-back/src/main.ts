import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module.js';

// Built SPA copied here by the production Dockerfile; absent in local development.
const PUBLIC_DIR = join(__dirname, '..', 'public');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // Behind Cloud Run's front end: use the client IP from X-Forwarded-For (rate limiting).
  app.set('trust proxy', 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          imgSrc: ["'self'", 'https://image.tmdb.org', 'data:', 'blob:'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          connectSrc: ["'self'", 'https://api.themoviedb.org'],
          mediaSrc: ["'self'", 'https://www.youtube.com'],
          frameSrc: ['https://www.youtube.com'],
        },
      },
    }),
  );
  app.setGlobalPrefix('api');

  if (existsSync(PUBLIC_DIR)) {
    // Vite emits content-hashed files under /assets, safe to cache forever.
    app.useStaticAssets(join(PUBLIC_DIR, 'assets'), {
      prefix: '/assets',
      maxAge: '1y',
      immutable: true,
    });
    app.useStaticAssets(PUBLIC_DIR, { index: false });
    // SPA fallback: client-side routes get index.html, /api stays with Nest.
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
      res.sendFile(join(PUBLIC_DIR, 'index.html'));
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = config.get<number>('PORT', 8000);
  app.enableShutdownHooks();
  await app.listen(port);
}
void bootstrap();
