import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { PrismaModule } from './infrastructure/persistence/prisma.module';

@Module({
  imports: [PrismaModule, HealthModule],
})
export class AppModule {}
