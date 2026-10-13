import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

config({ path: resolve(__dirname, '../../../.env') });

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
