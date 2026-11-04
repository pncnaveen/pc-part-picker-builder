import { Injectable } from '@nestjs/common';
import { Prisma } from '@pcppb/db';

import { DatabaseUnavailableError, EmailAlreadyRegisteredError } from '../../auth/register.errors';
import type { RegisterAccountPersistenceInput } from '../../auth/register.types';
import type { RegisterAccountPort } from '../../auth/register-account.port';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaRegisterAccountAdapter implements RegisterAccountPort {
  constructor(private readonly prisma: PrismaService) {}

  async createRegisteredAccount(input: RegisterAccountPersistenceInput): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.account.create({ data: this.mapToAccountCreate(input) });
        await tx.emailVerificationToken.create({
          data: this.mapToEmailVerificationTokenCreate(input),
        });
        await tx.messageOutbox.create({ data: this.mapToMessageOutboxCreate(input) });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private mapToAccountCreate(input: RegisterAccountPersistenceInput): Prisma.AccountCreateInput {
    return {
      id: input.accountId,
      email: input.email,
      password_hash: input.passwordHash,
      verified: false,
    };
  }

  private mapToEmailVerificationTokenCreate(
    input: RegisterAccountPersistenceInput,
  ): Prisma.EmailVerificationTokenCreateInput {
    return {
      id: input.verificationTokenId,
      account: { connect: { id: input.accountId } },
      token_hash: input.verificationTokenHash,
      expires_at: input.verificationTokenExpiresAt,
    };
  }

  private mapToMessageOutboxCreate(
    input: RegisterAccountPersistenceInput,
  ): Prisma.MessageOutboxCreateInput {
    return {
      id: input.outboxId,
      event_type: input.outboxEventType,
      payload: input.outboxPayload as Prisma.InputJsonValue,
    };
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new EmailAlreadyRegisteredError();
      }
    }

    if (this.isDatabaseUnavailable(error)) {
      throw new DatabaseUnavailableError();
    }

    throw error;
  }

  private isDatabaseUnavailable(error: unknown): boolean {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return true;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return ['P1001', 'P1002', 'P1017'].includes(error.code);
    }
    return false;
  }
}
