import 'package:flutter_gen/gen_l10n/app_localizations.dart';

const int minPasswordLength = 6;

const String _passwordTooShort = '__PASSWORD_TOO_SHORT__';
const String _passwordsDoNotMatch = '__PASSWORDS_DO_NOT_MATCH__';

String? validatePassword(String password) {
  if (password.length < minPasswordLength) {
    return _passwordTooShort;
  }
  return null;
}

String? validatePasswordMatch(String password, String confirmPassword) {
  if (password != confirmPassword) {
    return _passwordsDoNotMatch;
  }
  return null;
}

String? validatePasswordForm(String password, String confirmPassword) {
  final lengthError = validatePassword(password);
  if (lengthError != null) return lengthError;
  return validatePasswordMatch(password, confirmPassword);
}

String translateValidationError(String? code, AppLocalizations t) {
  switch (code) {
    case _passwordTooShort:
      return t.authPasswordMinLength(min: minPasswordLength);
    case _passwordsDoNotMatch:
      return t.authPasswordsDoNotMatch;
    default:
      return code ?? '';
  }
}
