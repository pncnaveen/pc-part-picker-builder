import { HttpStatus } from '@nestjs/common';

import { REGISTER_ERROR_CODES } from '@pcppb/shared';

import { ApiApplicationError } from '../infrastructure/http/api-application.error';

export class RegisterApplicationError extends ApiApplicationError {
  constructor(status: HttpStatus, code: string, message: string, details?: unknown) {
    super(status, code, message, details);
    this.name = 'RegisterApplicationError';
  }
}

export const INVALID_REQUEST_ERROR = new RegisterApplicationError(
  HttpStatus.BAD_REQUEST,
  'INVALID_REQUEST',
  'Request body must include email and password strings.',
);

export const INVALID_EMAIL_ERROR = new RegisterApplicationError(
  HttpStatus.BAD_REQUEST,
  REGISTER_ERROR_CODES.INVALID_EMAIL,
  'Enter a valid email address.',
  { field: 'email' },
);

export const INVALID_PASSWORD_ERROR = new RegisterApplicationError(
  HttpStatus.BAD_REQUEST,
  REGISTER_ERROR_CODES.INVALID_PASSWORD,
  'Password must be 8–12 characters with no spaces.',
  { field: 'password' },
);

export const EMAIL_ALREADY_REGISTERED_ERROR = new RegisterApplicationError(
  HttpStatus.CONFLICT,
  REGISTER_ERROR_CODES.EMAIL_ALREADY_REGISTERED,
  'An account with this email already exists.',
  { field: 'email' },
);

export const DATABASE_UNAVAILABLE_ERROR = new RegisterApplicationError(
  HttpStatus.SERVICE_UNAVAILABLE,
  'SERVICE_UNAVAILABLE',
  'Registration is temporarily unavailable. Please try again.',
);

/** Thrown by the register account adapter; mapped to HTTP errors in RegisterService. */
export class EmailAlreadyRegisteredError extends Error {
  readonly name = 'EmailAlreadyRegisteredError';
}

export class DatabaseUnavailableError extends Error {
  readonly name = 'DatabaseUnavailableError';
}
