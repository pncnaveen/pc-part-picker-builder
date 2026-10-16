import { config } from 'dotenv';
import { resolve } from 'node:path';

import { connectRabbitMq } from './messaging/connect-rabbitmq.js';

config({ path: resolve(import.meta.dirname, '../../../.env') });

async function bootstrap(): Promise<void> {
  const url = process.env.RABBITMQ_URL;
  if (!url) {
    throw new Error('RABBITMQ_URL is required (see .env.example at repo root)');
  }

  const connection = await connectRabbitMq(url);
  console.info('[worker] connected to RabbitMQ (no consumers registered — story 1.4 skeleton)');

  const shutdown = async (signal: string): Promise<void> => {
    console.info(`[worker] ${signal} received, closing RabbitMQ connection`);
    await connection.close();
    process.exit(0);
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

void bootstrap().catch((error: unknown) => {
  console.error('[worker] failed to start', error);
  process.exit(1);
});
