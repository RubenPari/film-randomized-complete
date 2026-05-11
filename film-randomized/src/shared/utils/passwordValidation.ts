/**
 * Password validation utilities.
 * Provides shared validation logic for password-related forms.
 */

/**
 * Minimum password length constant.
 */
export const MIN_PASSWORD_LENGTH = 8;

export const validatePassword = (password: string): string | null => {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validatePasswordForm = (password: string, confirmPassword: string): string | null => {
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return validatePasswordMatch(password, confirmPassword);
};
