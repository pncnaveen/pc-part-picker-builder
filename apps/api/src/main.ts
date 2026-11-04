import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

function configureSwagger(app: NestExpressApplication): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('PC Part Picker Builder API').setVersion('0.1.0').build(),
  );
  SwaggerModule.setup('api/docs', app, document);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureCors(app);
  configureSwagger(app);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
