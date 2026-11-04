/**
 * Domain package (AD-16). No Nest, Prisma, RabbitMQ, Redis, or React imports.
 */
export const DOMAIN_PACKAGE_VERSION = '0.0.0';

export { processRegistrationEmail } from './auth/email';
export { validatePassword } from './auth/password';
export type { RegistrationEmailResult, PasswordValidationResult } from './auth/auth.types';
