import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/filter_provider.dart';
import '../../providers/genres_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';

class GenreFilter extends ConsumerWidget {
  const GenreFilter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(filterProvider);
    final notifier = ref.read(filterProvider.notifier);
    final genresAsync = ref.watch(genresProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(
              Icons.category_outlined,
              size: 16,
              color: AppTheme.textBrand,
            ),
            const SizedBox(width: 6),
            Text(
              'Genres',
              style: TextStyle(
                color: AppTheme.textBrand,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        genresAsync.when(
          data: (genres) {
            return ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 300),
              child: SingleChildScrollView(
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: genres.map((genre) {
                    final id = genre['id'] as int;
                    final name = genre['name'] as String;
                    final isSelected = filter.selectedGenres.contains(id);
                    return FilterChip(
                      label: Text(name),
                      selected: isSelected,
                      onSelected: (_) => notifier.toggleGenre(id),
                      selectedColor: AppTheme.brandAccent.withValues(
                        alpha: 0.3,
                      ),
                      backgroundColor: const Color(0xB3384151), // slate-700/70
                      checkmarkColor: Colors.white,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : AppTheme.genreText,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                      side: BorderSide(
                        color: isSelected
                            ? AppTheme.brandAccent
                            : const Color(0x80475569), // slate-600/50
                      ),
                    );
                  }).toList(),
                ),
              ),
            );
          },
          loading: () => const Center(
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
          error: (_, _) => const Text(
            'Failed to load genres',
            style: TextStyle(color: AppTheme.textSecondary),
          ),
        ),
      ],
    );
  }
}
