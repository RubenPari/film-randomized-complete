import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/trailer_provider.dart';
import '../../theme/glass_effects.dart';
import 'media_card_poster.dart';
import 'media_card_info.dart';
import 'media_card_trailer.dart';
import 'save_buttons.dart';

class MediaCard extends ConsumerWidget {
  const MediaCard({super.key, required this.media});
  final Map<String, dynamic> media;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaTypeStr =
        (media['media_type'] as String?) ??
        (media['first_air_date'] != null ? 'tv' : 'movie');
    final mediaId = media['id'] as int;
    final trailerAsync = ref.watch(
      trailerProvider((mediaType: mediaTypeStr, id: mediaId)),
    );
    final posterPath = media['poster_path'] as String?;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: GlassEffects.mediaCard(),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Poster + Info row
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Poster (40% width)
                  SizedBox(
                    width: 120,
                    child: MediaCardPoster(
                      posterPath: posterPath,
                      tmdbId: mediaId,
                      mediaType: mediaTypeStr,
                    ),
                  ),
                  const SizedBox(width: 16),
                  // Info (60% width)
                  Expanded(child: MediaCardInfo(media: media)),
                ],
              ),
              // Save button
              const SizedBox(height: 16),
              SaveButtons(media: media),
              // Trailer
              trailerAsync.when(
                data: (key) {
                  if (key == null) return const SizedBox.shrink();
                  return MediaCardTrailer(trailerKey: key);
                },
                loading: () => const SizedBox.shrink(),
                error: (_, _) => const SizedBox.shrink(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
