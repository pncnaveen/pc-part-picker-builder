import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

config({ path: resolve(__dirname, '../../../.env') });

const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:5173';

function configureCors(app: NestExpressApplication): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const origin = process.env.FRONTEND_ORIGIN?.trim() || DEFAULT_FRONTEND_ORIGIN;

  app.enableCors({
    origin,
    credentials: true,
  });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureCors(app);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
