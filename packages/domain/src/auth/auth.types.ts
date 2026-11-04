export type RegistrationEmailResult =
  { ok: true; email: string } | { ok: false; reason: 'invalid_format' };

export type PasswordValidationResult =
  { ok: true } | { ok: false; reason: 'empty' | 'too_short' | 'too_long' | 'whitespace' };
