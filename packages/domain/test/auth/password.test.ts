import { describe, expect, it } from 'vitest';

import { validatePassword } from '../../src/auth/password';

describe('validatePassword', () => {
  it.each([
    ['Pass!234', true],
    ['12345678', true],
    ['', false],
    ['short', false],
    ['toolongpassword', false],
    ['has space', false],
    ['tab\there', false],
  ])('validatePassword(%j)', (password, expectedOk) => {
    const result = validatePassword(password);
    expect(result.ok).toBe(expectedOk);
  });
});
