/** Stable register API error codes (v1). */
export const REGISTER_ERROR_CODES = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
} as const;

export type RegisterErrorCode = (typeof REGISTER_ERROR_CODES)[keyof typeof REGISTER_ERROR_CODES];

export const EMAIL_VERIFICATION_JOB_TYPE = 'email_verification';
