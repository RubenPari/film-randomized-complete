import 'api_client.dart';
import '../utils/normalize_media_item.dart';

class DiscoveredApi {
  DiscoveredApi._();

  static Future<Map<String, dynamic>> recordDiscovered(
    Map<String, dynamic> media,
    String mediaType,
    String token,
  ) async {
    final payload = _buildPayload(media, mediaType);
    return ApiClient().post('/discovered', payload);
  }

  static Future<List<Map<String, dynamic>>> getDiscovered(String token) async {
    final response = await ApiClient().get('/discovered');
    final items = response['items'] ?? response;
    if (items is List) {
      return items
          .map((item) => normalizeMediaItem(item as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  static Future<void> removeDiscovered(
    String mediaType,
    int tmdbId,
    String token,
  ) async {
    await ApiClient().delete('/discovered/$mediaType/$tmdbId');
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
