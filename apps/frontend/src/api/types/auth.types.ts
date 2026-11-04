import type { ApiErrorBody, RegisterRequestBody, RegisterResponseBody } from '@pcppb/shared';

export type { ApiErrorBody, RegisterRequestBody, RegisterResponseBody };

export const REGISTER_ERROR_CODES = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
} as const;

export type RegisterFetchResult =
  | { kind: 'success'; response: RegisterResponseBody }
  | { kind: 'field_error'; code: string; message: string; field: 'email' | 'password' }
  | { kind: 'recoverable_error'; message: string };
