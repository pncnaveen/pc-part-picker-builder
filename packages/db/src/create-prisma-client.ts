import { PrismaClient } from './generated/prisma';

export function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}
