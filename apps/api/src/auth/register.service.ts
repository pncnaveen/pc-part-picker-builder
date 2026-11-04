import { createHash, randomBytes } from 'node:crypto';

import { Injectable, Inject } from '@nestjs/common';
import { processRegistrationEmail, validatePassword } from '@pcppb/domain';
import { EMAIL_VERIFICATION_JOB_TYPE, type RegisterResponseBody } from '@pcppb/shared';
import * as bcrypt from 'bcryptjs';
import { ulid } from 'ulid';

import {
  DATABASE_UNAVAILABLE_ERROR,
  DatabaseUnavailableError,
  EMAIL_ALREADY_REGISTERED_ERROR,
  EmailAlreadyRegisteredError,
  INVALID_EMAIL_ERROR,
  INVALID_PASSWORD_ERROR,
} from './register.errors';
import { REGISTER_ACCOUNT_PORT, type RegisterAccountPort } from './register-account.port';

const BCRYPT_COST = 12;
const VERIFICATION_TOKEN_BYTES = 32;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class RegisterService {
  constructor(
    @Inject(REGISTER_ACCOUNT_PORT) private readonly registerAccount: RegisterAccountPort,
  ) {}

  async register(rawEmail: string, rawPassword: string): Promise<RegisterResponseBody> {
    const emailResult = processRegistrationEmail(rawEmail);
    if (!emailResult.ok) {
      throw INVALID_EMAIL_ERROR;
    }
    const email = emailResult.email;
    const passwordResult = validatePassword(rawPassword);
    if (!passwordResult.ok) {
      throw INVALID_PASSWORD_ERROR;
    }

    const accountId = ulid();
    const passwordHash = await bcrypt.hash(rawPassword, BCRYPT_COST);
    const plainVerificationToken = randomBytes(VERIFICATION_TOKEN_BYTES).toString('base64url');
    const verificationTokenHash = createHash('sha256').update(plainVerificationToken).digest('hex');
    const verificationTokenId = ulid();
    const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    const outboxId = ulid();

    const outboxPayload = {
      jobType: EMAIL_VERIFICATION_JOB_TYPE,
      accountId,
      emailVerificationTokenId: verificationTokenId,
    };

    try {
      await this.registerAccount.createRegisteredAccount({
        accountId,
        email,
        passwordHash,
        verificationTokenId,
        verificationTokenHash,
        verificationTokenExpiresAt,
        outboxId,
        outboxEventType: EMAIL_VERIFICATION_JOB_TYPE,
        outboxPayload,
      });
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        throw EMAIL_ALREADY_REGISTERED_ERROR;
      }
      if (error instanceof DatabaseUnavailableError) {
        throw DATABASE_UNAVAILABLE_ERROR;
      }
      throw error;
    }

    return {
      accountId,
      message: 'Check your email to verify your account.',
    };
  }
}
