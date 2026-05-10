import '../config/api_config.dart';
import '../config/constants.dart';
import '../models/filter_state.dart';
import '../models/media_type.dart';
import 'tmdb_client.dart';

class TmdbApi {
  TmdbApi._();

  static final TmdbClient _client = TmdbClient();

  /// Discovers media based on provided filters. Returns (discoverUrl, totalPages).
  static Future<({String discoverUrl, int totalPages})> discoverMedia(
    MediaType mediaType,
    FilterState filters,
  ) async {
    final mediaTypeStr = mediaType == MediaType.movie ? 'movie' : 'tv';
    final endpoint = ApiConfig.discover(mediaTypeStr);
    final params = StringBuffer();

    params.write('vote_average.gte=${filters.minRating}');
    params.write('&vote_average.lte=${filters.maxRating}');

    if (filters.selectedGenres.isNotEmpty) {
      params.write('&with_genres=${filters.selectedGenres.join(',')}');
    }

    if (filters.releaseYearFrom > Constants.minReleaseYear) {
      final dateField = mediaType.isMovie
          ? 'primary_release_date.gte'
          : 'first_air_date.gte';
      params.write('&$dateField=${filters.releaseYearFrom}-01-01');
    }

    if (filters.releaseYearTo < DateTime.now().year) {
      final dateField = mediaType.isMovie
          ? 'primary_release_date.lte'
          : 'first_air_date.lte';
      params.write('&$dateField=${filters.releaseYearTo}-12-31');
    }

    if (filters.minVoteCount > 0) {
      params.write('&vote_count.gte=${filters.minVoteCount}');
    }

    final url = '$endpoint?${params.toString()}';
    final data = await _client.get(url);

    final results = data['results'] as List<dynamic>? ?? [];
    if (results.isEmpty) {
      throw TmdbError('No results found with these filters', 404);
    }

    final totalPages = (data['total_pages'] as int?) ?? 1;
    return (
      discoverUrl: url,
      totalPages: totalPages > Constants.tmdbMaxPage
          ? Constants.tmdbMaxPage
          : totalPages,
    );
  }

  /// Fetches a specific page of media results.
  static Future<Map<String, dynamic>> fetchMediaPage(
    String discoverUrl,
    int pageNumber,
  ) async {
    return _client.get('$discoverUrl&page=$pageNumber');
  }

  /// Fetches detailed information for a specific media item.
  static Future<Map<String, dynamic>> fetchMediaDetails(
    String mediaType,
    int mediaId,
  ) async {
    final endpoint = ApiConfig.details(mediaType, mediaId);
    return _client.get(endpoint);
  }

  /// Fetches videos (trailers, teasers) for a media item.
  /// Falls back to English if no videos found in current language.
  static Future<Map<String, dynamic>> fetchMediaVideos(
    String mediaType,
    int mediaId,
  ) async {
    final endpoint = ApiConfig.videos(mediaType, mediaId);
    final data = await _client.get(endpoint);

    final results = data['results'] as List<dynamic>? ?? [];
    if (results.isEmpty) {
      return _client.fetchRaw('$endpoint?language=en-US');
    }
    return data;
  }

  /// Module-level genre cache (same pattern as web app).
  static List<Map<String, dynamic>>? _cachedGenres;
  static Future<List<Map<String, dynamic>>>? _cachedGenresPromise;

  /// Fetches all genres (movie + TV), deduplicated by id, sorted by name.
  static Future<List<Map<String, dynamic>>> fetchGenres() async {
    if (_cachedGenres != null) return _cachedGenres!;

    _cachedGenresPromise ??= _fetchGenresInternal();

    return _cachedGenresPromise!;
  }

  static Future<List<Map<String, dynamic>>> _fetchGenresInternal() async {
    try {
      final results = await Future.wait([
        _client.get(ApiConfig.movieGenres),
        _client.get(ApiConfig.tvGenres),
      ]);

      final movieGenres = results[0]['genres'] as List<dynamic>;
      final tvGenres = results[1]['genres'] as List<dynamic>;

      final uniqueMap = <int, Map<String, dynamic>>{};
      for (final genre in movieGenres) {
        final g = genre as Map<String, dynamic>;
        uniqueMap[g['id'] as int] = g;
      }
      for (final genre in tvGenres) {
        final g = genre as Map<String, dynamic>;
        uniqueMap.putIfAbsent(g['id'] as int, () => g);
      }

      _cachedGenres = uniqueMap.values.toList()
        ..sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      return _cachedGenres!;
    } catch (e) {
      _cachedGenresPromise = null;
      rethrow;
    }
  }
}
