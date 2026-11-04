/**
 * Cross-cutting types, errors, and message contracts (API + SPA + worker).
 */
export const SHARED_PACKAGE_VERSION = '0.0.0';

export {
  EMAIL_VERIFICATION_JOB_TYPE,
  REGISTER_ERROR_CODES,
  type RegisterErrorCode,
} from './auth/register.codes';
export type {
  ApiErrorBody,
  RegisterRequestBody,
  RegisterResponseBody,
} from './auth/register.types';
