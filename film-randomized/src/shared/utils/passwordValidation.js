/**
 * Password validation utilities.
 * Provides shared validation logic for password-related forms.
 */

/**
 * Minimum password length constant.
 */
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Validates a password meets minimum requirements.
 *
 * @param {string} password - The password to validate
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validatePassword = (password) => {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

/**
 * Validates that two passwords match.
 *
 * @param {string} password - The new password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Validates password requirements and match confirmation.
 *
 * @param {string} password - The new password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validatePasswordForm = (password, confirmPassword) => {
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return validatePasswordMatch(password, confirmPassword);
};
