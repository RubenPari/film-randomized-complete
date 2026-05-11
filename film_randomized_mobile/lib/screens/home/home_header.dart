import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/locale_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/glass_effects.dart';

class HomeHeader extends ConsumerWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider).valueOrNull;
    final user = auth?.user;
    final t = AppLocalizations.of(context)!;
    final locale = ref.watch(localeProvider);
    final initial = user?.username.isNotEmpty == true
        ? user!.username[0].toUpperCase()
        : '?';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: GlassEffects.card(),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user?.username ?? '',
                  style: const TextStyle(
                      color: AppTheme.textPrimary, fontWeight: FontWeight.bold),
                ),
                Text(
                  user?.email ?? '',
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 12),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0x331e293b),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0x80334155)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _LangChip(
                  label: 'EN',
                  isActive: locale.languageCode == 'en',
                  onTap: () => ref.read(localeProvider.notifier).setLocale('en'),
                ),
                _LangChip(
                  label: 'IT',
                  isActive: locale.languageCode == 'it',
                  onTap: () => ref.read(localeProvider.notifier).setLocale('it'),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.bookmark_outline, color: AppTheme.textBrand),
            onPressed: () => context.go('/watchlist'),
            tooltip: t.commonWatchlist,
          ),
          IconButton(
            icon: const Icon(Icons.explore_outlined, color: AppTheme.textBrand),
            onPressed: () => context.go('/discovered'),
            tooltip: t.commonDiscovered,
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Color(0xFFef4444)),
            onPressed: () => ref.read(authProvider.notifier).logout(),
            tooltip: t.commonLogout,
          ),
          const SizedBox(width: 4),
          CircleAvatar(
            radius: 16,
            backgroundColor: AppTheme.brandAccent,
            child: Text(initial,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
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
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.brandAccent.withValues(alpha: 0.3)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? AppTheme.brandAccent : AppTheme.textSecondary,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            fontSize: 11,
          ),
        ),
      ),
    );
  }
}