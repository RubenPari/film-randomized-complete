import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';
import '../../utils/password_validation.dart';
import 'auth_form_layout.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    await ref
        .read(authProvider.notifier)
        .register(
          _usernameController.text.trim(),
          _emailController.text.trim(),
          _passwordController.text,
        );
    if (!mounted) return;
    final auth = ref.read(authProvider).valueOrNull;
    if (auth?.token != null) {
      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider).valueOrNull;
    final isLoading = auth?.isLoading ?? false;
    final t = AppLocalizations.of(context)!;

    return AuthFormLayout(
      icon: Icons.person_add_rounded,
      title: t.authRegisterTitle,
      subtitle: t.authRegisterDescription,
      error: auth?.error,
      footer: TextButton(
        onPressed: () => context.go('/login'),
        child: RichText(
          text: TextSpan(
            style: const TextStyle(color: AppTheme.textSecondary),
            children: [
              TextSpan(text: '${t.authAlreadyHaveAccount} '),
              TextSpan(
                text: t.authSignInInstead,
                style: const TextStyle(
                  color: AppTheme.brandAccent,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            TextFormField(
              controller: _usernameController,
              enabled: !isLoading,
              decoration: InputDecoration(
                labelText: t.authUsername,
                hintText: t.authUsernamePlaceholder,
                prefixIcon: const Icon(Icons.person_outline),
              ),
              validator: (v) =>
                  v == null || v.trim().isEmpty ? t.authUsernameRequired : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailController,
              enabled: !isLoading,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: t.authEmail,
                hintText: t.authEmailPlaceholder,
                prefixIcon: const Icon(Icons.email_outlined),
              ),
              validator: (v) {
                if (v == null || v.trim().isEmpty) return t.authEmailRequired;
                if (!v.contains('@')) return t.authInvalidEmail;
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _passwordController,
              enabled: !isLoading,
              obscureText: _obscurePassword,
              decoration: InputDecoration(
                labelText: t.authPassword,
                hintText: t.authPasswordPlaceholder,
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () =>
                      setState(() => _obscurePassword = !_obscurePassword),
                ),
              ),
              validator: (v) =>
                  translateValidationError(validatePassword(v ?? ''), t),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _confirmPasswordController,
              enabled: !isLoading,
              obscureText: _obscureConfirm,
              decoration: InputDecoration(
                labelText: t.authConfirmPassword,
                hintText: t.authConfirmPasswordPlaceholder,
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureConfirm ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () =>
                      setState(() => _obscureConfirm = !_obscureConfirm),
                ),
              ),
              validator: (v) => translateValidationError(
                  validatePasswordMatch(_passwordController.text, v ?? ''), t),
            ),
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: BrandGradients.primary,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.brandAccent.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : Text(
                        t.authRegister,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
