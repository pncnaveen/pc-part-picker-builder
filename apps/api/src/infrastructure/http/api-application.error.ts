import { HttpException, HttpStatus } from '@nestjs/common';

/** Base for feature-level HTTP errors thrown from application services and mapped in controllers. */
export class ApiApplicationError extends Error {
  constructor(
    readonly status: HttpStatus,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiApplicationError';
  }

  toHttpException(): HttpException {
    return new HttpException(
      { code: this.code, message: this.message, details: this.details },
      this.status,
    );
  }
}
