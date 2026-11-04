import { describe, expect, it } from 'vitest';

import { processRegistrationEmail } from '../../src/auth/email';

describe('processRegistrationEmail', () => {
  it('trims and lowercases valid email', () => {
    expect(processRegistrationEmail('  User@Example.COM ')).toEqual({
      ok: true,
      email: 'user@example.com',
    });
  });

  it.each([
    ['user@example.com', true],
    ['user.name+tag@example.co.in', true],
    ['', false],
    ['   ', false],
    ['not-an-email', false],
    ['missing@', false],
    ['@nodomain.com', false],
  ])('processRegistrationEmail(%s) valid -> %s', (input, expectedValid) => {
    const result = processRegistrationEmail(input);
    if (expectedValid) {
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.email).toBe(input.trim().toLowerCase());
      }
    } else {
      expect(result).toEqual({ ok: false, reason: 'invalid_format' });
    }
  });
});
