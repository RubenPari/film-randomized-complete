import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/tmdb_api.dart';

/// Provider for genres list with keepAlive (mirrors web's module-level cache).
final genresProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  return TmdbApi.fetchGenres();
});