import { Injectable } from '@nestjs/common';
import { pingDatabase } from '@pcppb/db';

import type { DatabaseHealthPort } from '../../health/database-health.port';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaDatabaseHealthAdapter implements DatabaseHealthPort {
  constructor(private readonly prisma: PrismaService) {}

  async assertReachable(): Promise<void> {
    await pingDatabase(this.prisma);
  }
}
