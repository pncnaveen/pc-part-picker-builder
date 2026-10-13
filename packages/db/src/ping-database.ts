import type { PrismaClient } from '@prisma/client';

/** Lightweight connectivity check — no domain tables required. */
export async function pingDatabase(client: PrismaClient): Promise<void> {
  await client.$queryRaw`SELECT 1`;
}
