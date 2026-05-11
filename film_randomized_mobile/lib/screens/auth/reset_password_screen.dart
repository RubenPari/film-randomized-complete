import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';
import '../../services/auth_api.dart';
import '../../utils/password_validation.dart';
import 'auth_form_layout.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key, this.token});
  final String? token;

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _isLoading = false;
  String? _error;
  bool _success = false;
  bool _obscurePassword = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (widget.token == null) return;
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await AuthApi.resetPassword(widget.token!, _passwordController.text);
      setState(() => _success = true);
      await Future.delayed(const Duration(seconds: 3));
      if (mounted) context.go('/login');
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;

    if (widget.token == null) {
      return AuthFormLayout(
        icon: Icons.error_outline,
        title: t.authInvalidLink,
        error: t.authResetTokenError,
        child: TextButton(
          onPressed: () => context.go('/login'),
          child: Text(t.authBackToLogin,
              style: const TextStyle(color: AppTheme.brandAccent)),
        ),
      );
    }

    return AuthFormLayout(
      icon: Icons.password_rounded,
      title: t.authResetPasswordTitle,
      error: _error,
      child: _success
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0x1A22c55e),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF22c55e)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_outline, color: Color(0xFF22c55e)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      t.authResetPasswordSuccess,
                      style: const TextStyle(color: Color(0xFF86efac)),
                    ),
                  ),
                ],
              ),
            )
          : Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _passwordController,
                    enabled: !_isLoading,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: t.authNewPassword,
                      hintText: t.authNewPasswordPlaceholder,
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePassword
                            ? Icons.visibility_off
                            : Icons.visibility),
                        onPressed: () =>
                            setState(() => _obscurePassword = !_obscurePassword),
                      ),
                    ),
                    validator: (v) =>
                        translateValidationError(validatePassword(v ?? ''), t),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _confirmController,
                    enabled: !_isLoading,
                    obscureText: _obscureConfirm,
                    decoration: InputDecoration(
                      labelText: t.authConfirmPassword,
                      hintText: t.authConfirmPasswordPlaceholder,
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(_obscureConfirm
                            ? Icons.visibility_off
                            : Icons.visibility),
                        onPressed: () =>
                            setState(() => _obscureConfirm = !_obscureConfirm),
                      ),
                    ),
                    validator: (v) => translateValidationError(
                        validatePasswordMatch(
                            _passwordController.text, v ?? ''),
                        t),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: BrandGradients.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white))
                          : Text(t.authResetPassword,
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}