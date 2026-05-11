import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/filter_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';
import '../../models/media_type.dart';

class HomeHero extends ConsumerWidget {
  const HomeHero({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(filterProvider);
    final t = AppLocalizations.of(context)!;
    final typeLabel = filter.mediaType == MediaType.movie
        ? t.homeMovie
        : t.homeTvShow;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Column(
        children: [
          ShaderMask(
            shaderCallback: (bounds) =>
                BrandGradients.titleText.createShader(bounds),
            child: Text(
              t.homeTitle(typeLabel),
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            t.homeDescription,
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}