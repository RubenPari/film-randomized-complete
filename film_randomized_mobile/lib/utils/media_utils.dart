import 'dart:math';
import '../models/media_type.dart';

/// Coerces a media type value to canonical string form.
String resolveMediaTypeString(MediaType mediaType) {
  return mediaType == MediaType.movie ? 'movie' : 'tv';
}

/// Whether this tmdb id is excluded for the current bucket (same media type only).
bool isExcludedForCurrentType(
    int tmdbId, String currentMediaType, List<dynamic> excludedItems) {
  if (excludedItems.isEmpty) return false;
  return excludedItems.any((item) {
    final id = item['tmdb_id'] ?? item['tmdbId'];
    final mt = getMediaTypeFromItem(item);
    return id == tmdbId && mt == currentMediaType;
  });
}

/// Checks if a media item has a valid description.
bool hasValidDescription(Map<String, dynamic> media) {
  final overview = media['overview'] as String?;
  if (overview == null || overview.trim().isEmpty) return false;
  if (overview == 'Nessuna descrizione disponibile in italiano.') return false;
  return true;
}

/// Filters out excluded items and items without a valid overview.
List<Map<String, dynamic>> filterValidMedia(
    List<dynamic> results, List<dynamic> excludedItems, MediaType mediaType) {
  final mt = resolveMediaTypeString(mediaType);
  return results.where((media) {
    if (isExcludedForCurrentType(media['id'] as int, mt, excludedItems)) {
      return false;
    }
    return hasValidDescription(media as Map<String, dynamic>);
  }).map((e) => e as Map<String, dynamic>).toList();
}

/// Generates a random page number within the total pages.
int getRandomPage(int totalPages) {
  return Random().nextInt(totalPages) + 1;
}

/// Selects a random media item from an array.
Map<String, dynamic> getRandomMedia(List<Map<String, dynamic>> mediaArray) {
  return mediaArray[Random().nextInt(mediaArray.length)];
}

/// Matches a media item against a collection tab filter.
bool matchesMediaListFilter(Map<String, dynamic> item, String filter) {
  if (filter == 'all') return true;
  final mt = getMediaTypeFromItem(item);
  if (mt == null) return false;
  if (filter == 'movies') return mt == 'movie';
  if (filter == 'tv') return mt == 'tv';
  return true;
}

/// Extracts media type from an item (handles both snake_case and camelCase).
String? getMediaTypeFromItem(Map<String, dynamic> item) {
  final mt = item['media_type'] ?? item['mediaType'];
  if (mt == true) return 'movie';
  if (mt == false) return 'tv';
  if (mt == 'movie' || mt == 'tv') return mt as String;
  return null;
}