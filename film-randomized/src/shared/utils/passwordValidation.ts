export const MIN_PASSWORD_LENGTH = 8;

export type PasswordValidationCode = 'tooShort' | 'mismatch';

export const validatePasswordForm = (
  password: string,
  confirmPassword: string
): PasswordValidationCode | null => {
  if (!password || password.length < MIN_PASSWORD_LENGTH) return 'tooShort';
  if (password !== confirmPassword) return 'mismatch';
  return null;
};
