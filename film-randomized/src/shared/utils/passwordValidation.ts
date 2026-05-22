/**
 * Password validation utilities.
 * Provides shared validation logic for password-related forms.
 */

/**
 * Minimum password length constant.
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Valida la password
 * @param password Password da validare
 * @returns Messaggio di errore se la password non è valida, null altrimenti
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

/**
 * Valida la corrispondenza tra due password
 * @param password Prima password
 * @param confirmPassword Seconda password
 * @returns Messaggio di errore se le password non corrispondono, null altrimenti
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Valida l'intero form della password
 * @param password Password da validare
 * @param confirmPassword Conferma password
 * @returns Messaggio di errore se la password non è valida, null altrimenti
 */
export const validatePasswordForm = (password: string, confirmPassword: string): string | null => {
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return validatePasswordMatch(password, confirmPassword);
};
