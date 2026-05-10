import 'api_client.dart';
import '../utils/normalize_media_item.dart';

class WatchlistApi {
  WatchlistApi._();

  static Future<Map<String, dynamic>> addToWatchlist(
    Map<String, dynamic> media,
    String mediaType,
    String token,
  ) async {
    final payload = _buildPayload(media, mediaType);
    return ApiClient().post('/watchlist', payload);
  }

  static Future<List<Map<String, dynamic>>> getWatchlist(String token) async {
    final response = await ApiClient().get('/watchlist');
    final items = response['items'] ?? response;
    if (items is List) {
      return items
          .map((item) => normalizeMediaItem(item as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  static Future<bool> checkInWatchlist(int tmdbId, String token) async {
    try {
      await ApiClient().get('/watchlist/$tmdbId');
      return true;
    } catch (_) {
      return false;
    }
  }

  static Future<void> removeFromWatchlist(int tmdbId, String token) async {
    await ApiClient().delete('/watchlist/$tmdbId');
  }

  static Map<String, dynamic> _buildPayload(
    Map<String, dynamic> media,
    String mediaType,
  ) {
    return {
      'tmdb_id': media['id'] ?? media['tmdb_id'],
      'media_type': mediaType,
      'title': media['title'] ?? media['name'] ?? '',
      'original_title': media['original_title'] ?? media['original_name'],
      'overview': media['overview'],
      'poster_path': media['poster_path'],
      'backdrop_path': media['backdrop_path'],
      'vote_average': media['vote_average'],
      'vote_count': media['vote_count'],
      'release_date': media['release_date'] ?? media['first_air_date'],
      'genres': media['genres'] is String
          ? media['genres']
          : media['genres']?.toString(),
      'runtime': media['runtime'],
      'number_of_seasons': media['number_of_seasons'],
      'number_of_episodes': media['number_of_episodes'],
    };
  }
}
