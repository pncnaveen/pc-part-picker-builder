import { ApiProperty } from '@nestjs/swagger';

import type { ApiErrorBody, RegisterRequestBody, RegisterResponseBody } from '@pcppb/shared';

export class RegisterRequestDto implements RegisterRequestBody {
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Pass!234', minLength: 8, maxLength: 12 })
  password!: string;
}

export class RegisterResponseDto implements RegisterResponseBody {
  @ApiProperty({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' })
  accountId!: string;

  @ApiProperty({ example: 'Check your email to verify your account.' })
  message!: string;
}

export class ApiErrorResponseDto implements ApiErrorBody {
  @ApiProperty({ example: 'INVALID_EMAIL' })
  code!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty({ required: false })
  details?: unknown;
}

/** Input for RegisterAccountPort (application → persistence); not an HTTP body. */
export type RegisterAccountPersistenceInput = {
  accountId: string;
  email: string;
  passwordHash: string;
  verificationTokenId: string;
  verificationTokenHash: string;
  verificationTokenExpiresAt: Date;
  outboxId: string;
  outboxEventType: string;
  outboxPayload: Record<string, unknown>;
};
