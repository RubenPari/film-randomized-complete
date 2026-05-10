import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/tmdb_api.dart';

/// Provider for trailer key by mediaType + id.
/// Priority: YouTube Trailer > YouTube Teaser > any YouTube video > null.
final trailerProvider =
    FutureProvider.family<String?, ({String mediaType, int id})>((
      ref,
      params,
    ) async {
      final data = await TmdbApi.fetchMediaVideos(params.mediaType, params.id);
      final results = data['results'] as List<dynamic>? ?? [];

      // Priority: Trailer > Teaser > any YouTube video
      String? trailerKey;
      String? teaserKey;
      String? anyYouTubeKey;

      for (final video in results) {
        final v = video as Map<String, dynamic>;
        final site = v['site'] as String? ?? '';
        final type = v['type'] as String? ?? '';
        final key = v['key'] as String?;

        if (site != 'YouTube' || key == null) continue;

        if (type == 'Trailer' && trailerKey == null) {
          trailerKey = key;
        } else if (type == 'Teaser' && teaserKey == null) {
          teaserKey = key;
        } else
          anyYouTubeKey ??= key;
      }

      return trailerKey ?? teaserKey ?? anyYouTubeKey;
    });
