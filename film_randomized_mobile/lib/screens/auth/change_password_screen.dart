import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../theme/brand_gradients.dart';
import '../../utils/password_validation.dart';
import 'auth_form_layout.dart';

class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  ConsumerState<ChangePasswordScreen> createState() =>
      _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currentController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _isLoading = false;
  String? _error;
  bool _success = false;

  @override
  void dispose() {
    _currentController.dispose();
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    final result = await ref.read(authProvider.notifier).changePassword(
          _currentController.text,
          _newController.text,
        );
    setState(() {
      _isLoading = false;
      if (result == null) {
        _success = true;
        _currentController.clear();
        _newController.clear();
        _confirmController.clear();
      } else {
        _error = result;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider).valueOrNull;
    final t = AppLocalizations.of(context)!;

    return AuthFormLayout(
      icon: Icons.key_rounded,
      title: t.authChangePasswordTitle,
      subtitle: auth?.user?.email ?? '',
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
                      t.authChangePasswordSuccess,
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
                    controller: _currentController,
                    enabled: !_isLoading,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: t.authCurrentPassword,
                      hintText: t.authCurrentPasswordPlaceholder,
                      prefixIcon: const Icon(Icons.lock_outline),
                    ),
                    validator: (v) =>
                        v == null || v.isEmpty ? t.authRequired : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _newController,
                    enabled: !_isLoading,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: t.authNewPassword,
                      hintText: t.authNewPasswordPlaceholder,
                      prefixIcon: const Icon(Icons.lock_outline),
                    ),
                    validator: (v) =>
                        translateValidationError(validatePassword(v ?? ''), t),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _confirmController,
                    enabled: !_isLoading,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: t.authConfirmPassword,
                      hintText: t.authConfirmPasswordPlaceholder,
                      prefixIcon: const Icon(Icons.lock_outline),
                    ),
                    validator: (v) => translateValidationError(
                        validatePasswordMatch(_newController.text, v ?? ''), t),
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
                          : Text(t.authChangePassword,
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