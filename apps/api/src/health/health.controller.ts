import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';

import { DATABASE_HEALTH_PORT, type DatabaseHealthPort } from './database-health.port';
import type { HealthResponse } from './health-response.types';

@Controller()
export class HealthController {
  constructor(
    @Inject(DATABASE_HEALTH_PORT) private readonly databaseHealth: DatabaseHealthPort,
  ) {}

  @Get('health')
  async getHealth(): Promise<HealthResponse> {
    try {
      await this.databaseHealth.assertReachable();
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        checks: { database: 'error' },
      } satisfies HealthResponse);
    }

    return {
      status: 'ok',
      checks: { database: 'ok' },
    };
  }
}
