import { Module } from '@nestjs/common';

import { PrismaDatabaseHealthAdapter } from '../infrastructure/persistence/prisma-database-health.adapter';
import { DATABASE_HEALTH_PORT } from './database-health.port';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    PrismaDatabaseHealthAdapter,
    { provide: DATABASE_HEALTH_PORT, useExisting: PrismaDatabaseHealthAdapter },
  ],
})
export class HealthModule {}
