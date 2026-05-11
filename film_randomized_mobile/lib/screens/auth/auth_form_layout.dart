import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/locale_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';
import '../../theme/glass_effects.dart';

class AuthFormLayout extends StatelessWidget {
  const AuthFormLayout({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.error,
    required this.child,
    this.footer,
    this.showLanguageSwitcher = true,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final String? error;
  final Widget child;
  final Widget? footer;
  final bool showLanguageSwitcher;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [AppTheme.bgPrimary, AppTheme.bgSecondary, AppTheme.bgPrimary],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (showLanguageSwitcher)
                    Align(
                      alignment: Alignment.topCenter,
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: _LanguageSwitcherLink(),
                      ),
                    ),
                  Container(
                    decoration: GlassEffects.authCard(),
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: BrandGradients.primary,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Icon(icon, size: 32, color: Colors.white),
                        ),
                        const SizedBox(height: 24),
                        ShaderMask(
                          shaderCallback: (bounds) =>
                              BrandGradients.titleText.createShader(bounds),
                          child: Text(
                            title,
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                        if (subtitle != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            subtitle!,
                            style: const TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 14,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                        if (error != null) ...[
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0x4D7f1d1d),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF991b1b)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.error_outline,
                                    color: Color(0xFFef4444), size: 20),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    error!,
                                    style: const TextStyle(
                                        color: Color(0xFFfca5a5), fontSize: 14),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 24),
                        child,
                        if (footer != null) ...[
                          const SizedBox(height: 24),
                          footer!,
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LanguageSwitcherLink extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        _LangChip(
            label: 'EN',
            isActive: Localizations.localeOf(context).languageCode == 'en',
            onTap: () {
              final container = ProviderScope.containerOf(context);
              container.read(localeProvider.notifier).setLocale('en');
            }),
        const SizedBox(width: 4),
        _LangChip(
            label: 'IT',
            isActive: Localizations.localeOf(context).languageCode == 'it',
            onTap: () {
              final container = ProviderScope.containerOf(context);
              container.read(localeProvider.notifier).setLocale('it');
            }),
      ],
    );
  }
}

class _LangChip extends StatelessWidget {
  const _LangChip(
      {required this.label, required this.isActive, required this.onTap});
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.brandAccent.withValues(alpha: 0.3)
              : const Color(0x331e293b),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isActive ? AppTheme.brandAccent : const Color(0x80334155),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? AppTheme.brandAccent : AppTheme.textSecondary,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}