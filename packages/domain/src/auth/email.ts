import { EMAIL_FORMAT } from './auth.constants';
import type { RegistrationEmailResult } from './auth.types';

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function isValidNormalizedEmail(normalized: string): boolean {
  if (normalized.length === 0 || normalized.length > 254) {
    return false;
  }
  return EMAIL_FORMAT.test(normalized);
}

/** Validate registration email and return normalized form for storage and uniqueness. */
export function processRegistrationEmail(raw: string): RegistrationEmailResult {
  const email = normalizeEmail(raw);
  if (!isValidNormalizedEmail(email)) {
    return { ok: false, reason: 'invalid_format' };
  }
  return { ok: true, email };
}
