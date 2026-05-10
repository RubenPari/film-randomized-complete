import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/discovered_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/loading_spinner.dart';
import '../collection/collection_content.dart';

class DiscoveredScreen extends ConsumerWidget {
  const DiscoveredScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final discoveredAsync = ref.watch(discoveredProvider);

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
                  'Discovered titles',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: discoveredAsync.when(
                  data: (items) => CollectionContent(
                    items: items,
                    onRemove: (item) {
                      final mediaType =
                          (item['media_type'] ?? item['mediaType'] ?? 'movie')
                              as String;
                      final tmdbId =
                          (item['tmdb_id'] ?? item['tmdbId']) as int;
                      return ref
                          .read(discoveredProvider.notifier)
                          .remove(mediaType, tmdbId);
                    },
                    emptyIcon: Icons.explore_outlined,
                    emptyTitle: 'No discovered titles yet',
                    emptyDescription:
                        'Titles you generate appear here and will not be suggested again until you remove them.',
                    emptyCtaLabel: 'Generate random titles',
                    emptyFilterTitle: (filter) => filter == 'movies'
                        ? 'No discovered movies yet'
                        : 'No discovered TV shows yet',
                  ),
                  loading: () => const LoadingSpinner(
                      label: 'Loading discovered titles...'),
                  error: (e, _) => Center(
                    child: Text('Error loading discovered: $e',
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