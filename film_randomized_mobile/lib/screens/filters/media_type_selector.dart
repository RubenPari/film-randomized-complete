import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/media_type.dart';
import '../../providers/filter_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';

class MediaTypeSelector extends ConsumerWidget {
  const MediaTypeSelector({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(filterProvider);
    final isMovie = filter.mediaType == MediaType.movie;

    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () =>
                ref.read(filterProvider.notifier).setMediaType(MediaType.movie),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                gradient: isMovie ? BrandGradients.primary : null,
                color: isMovie ? null : const Color(0x33475569), // slate-600/20
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isMovie
                      ? Colors.transparent
                      : const Color(0x80334155),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.movie_outlined,
                      size: 20,
                      color: isMovie ? Colors.white : AppTheme.textSecondary),
                  const SizedBox(width: 8),
                  Text(
                    'Movies',
                    style: TextStyle(
                      color: isMovie ? Colors.white : AppTheme.textSecondary,
                      fontWeight: isMovie ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: GestureDetector(
            onTap: () =>
                ref.read(filterProvider.notifier).setMediaType(MediaType.tv),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                gradient: !isMovie ? BrandGradients.primary : null,
                color: !isMovie ? null : const Color(0x33475569),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: !isMovie
                      ? Colors.transparent
                      : const Color(0x80334155),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.tv_outlined,
                      size: 20,
                      color: !isMovie ? Colors.white : AppTheme.textSecondary),
                  const SizedBox(width: 8),
                  Text(
                    'TV Shows',
                    style: TextStyle(
                      color: !isMovie ? Colors.white : AppTheme.textSecondary,
                      fontWeight: !isMovie ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}