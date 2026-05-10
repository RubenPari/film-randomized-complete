import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/watchlist_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/loading_spinner.dart';
import '../collection/collection_content.dart';

class WatchlistScreen extends ConsumerWidget {
  const WatchlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final watchlistAsync = ref.watch(watchlistProvider);

    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ShaderMask(
                shaderCallback: (bounds) =>
                    const LinearGradient(
                      colors: [Color(0xFF67e8f9), Color(0xFF93c5fd), Color(0xFF67e8f9)],
                    ).createShader(bounds),
                child: const Text(
                  'My Watchlist',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: watchlistAsync.when(
                  data: (items) => CollectionContent(
                    items: items,
                    onRemove: (item) {
                      final tmdbId =
                          (item['tmdb_id'] ?? item['tmdbId']) as int;
                      return ref
                          .read(watchlistProvider.notifier)
                          .remove(tmdbId);
                    },
                    emptyIcon: Icons.bookmark_outline,
                    emptyTitle: 'Your watchlist is empty',
                    emptyDescription:
                        'Start building your watchlist by adding movies and TV shows you want to watch.',
                    emptyCtaLabel: 'Discover new content',
                    emptyFilterTitle: (filter) => filter == 'movies'
                        ? 'No movies yet'
                        : 'No TV shows yet',
                  ),
                  loading: () => const LoadingSpinner(
                      label: 'Loading your watchlist...'),
                  error: (e, _) => Center(
                    child: Text('Error loading watchlist: $e',
                        style: const TextStyle(color: Color(0xFFef4444))),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}