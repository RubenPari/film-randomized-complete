/// Normalises a media-collection row coming from the backend (camelCase)
/// into a UI-friendly snake_case shape.
Map<String, dynamic> normalizeMediaItem(Map<String, dynamic> item) {
  if (item.isEmpty) return item;

  final rawTmdb = item['tmdb_id'] ?? item['tmdbId'];
  final tmdbId = rawTmdb is String ? int.tryParse(rawTmdb) ?? rawTmdb : rawTmdb;

  var mediaType = item['media_type'] ?? item['mediaType'];
  if (mediaType == true) mediaType = 'movie';
  if (mediaType == false) mediaType = 'tv';

  return {
    ...item,
    'tmdb_id': tmdbId,
    'media_type': mediaType,
    'poster_path': item['poster_path'] ?? item['posterPath'],
    'backdrop_path': item['backdrop_path'] ?? item['backdropPath'],
    'original_title': item['original_title'] ?? item['originalTitle'],
    'vote_average': item['vote_average'] ?? item['voteAverage'],
    'vote_count': item['vote_count'] ?? item['voteCount'],
    'release_date': item['release_date'] ?? item['releaseDate'],
  };
}

/// Stable identity key used by collection lists for filtering / removal.
/// Disambiguates same tmdb_id as both movie and tv.
String getMediaItemKey(Map<String, dynamic> item) {
  final id = item['tmdb_id'] ?? item['tmdbId'];
  final mt = item['media_type'] ?? item['mediaType'] ?? 'movie';
  return '$mt-$id';
}
