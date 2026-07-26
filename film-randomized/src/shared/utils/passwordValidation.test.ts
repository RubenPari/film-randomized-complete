import { describe, expect, it } from 'vitest';
import { MIN_PASSWORD_LENGTH, validatePasswordForm } from './passwordValidation.js';

describe('validatePasswordForm', () => {
  it('returns the stable tooShort code', () => {
    expect(validatePasswordForm('x'.repeat(MIN_PASSWORD_LENGTH - 1), 'anything')).toBe('tooShort');
  });

  it('returns the stable mismatch code', () => {
    expect(validatePasswordForm('password', 'different')).toBe('mismatch');
  });

  it('returns null for a valid matching password', () => {
    expect(validatePasswordForm('password', 'password')).toBeNull();
  });
});
