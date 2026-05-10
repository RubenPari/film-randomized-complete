import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/filter_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';

class RatingFilter extends ConsumerWidget {
  const RatingFilter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(filterProvider);
    final notifier = ref.read(filterProvider.notifier);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.star_outline, size: 16, color: AppTheme.textBrand),
            const SizedBox(width: 6),
            Text('Rating',
                style: TextStyle(
                    color: AppTheme.textBrand,
                    fontWeight: FontWeight.bold,
                    fontSize: 12)),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Text('Min: ${filter.minRating.toStringAsFixed(1)}',
                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14)),
            Expanded(
              child: Slider(
                value: filter.minRating,
                min: 0,
                max: 10,
                divisions: 20,
                onChanged: (v) => notifier.setMinRating(v),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Text('Max: ${filter.maxRating.toStringAsFixed(1)}',
                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14)),
            Expanded(
              child: Slider(
                value: filter.maxRating,
                min: 0,
                max: 10,
                divisions: 20,
                onChanged: (v) => notifier.setMaxRating(v),
              ),
            ),
          ],
        ),
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              gradient: BrandGradients.primary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '${filter.minRating.toStringAsFixed(1)} - ${filter.maxRating.toStringAsFixed(1)}',
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),
        ),
      ],
    );
  }
}