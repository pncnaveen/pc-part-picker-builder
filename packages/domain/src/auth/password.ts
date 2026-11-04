import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_WHITESPACE_PATTERN,
} from './auth.constants';
import type { PasswordValidationResult } from './auth.types';

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length === 0) {
    return { ok: false, reason: 'empty' };
  }
  if (PASSWORD_WHITESPACE_PATTERN.test(password)) {
    return { ok: false, reason: 'whitespace' };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, reason: 'too_short' };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, reason: 'too_long' };
  }
  return { ok: true };
}
