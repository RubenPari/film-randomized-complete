import '../config/constants.dart';
import '../models/media_type.dart';
import 'media_utils.dart';

typedef FetchPage = Future<Map<String, dynamic>> Function(int page);
typedef FetchDetails = Future<Map<String, dynamic>> Function(
    String mediaType, int id);

/// Pure async picker for the random-media flow.
/// Every external dependency is injected via fetchPage/fetchDetails.
///
/// Algorithm:
/// 1. Pick a random page from [1, totalPages].
/// 2. Apply filterValidMedia to drop excluded ids + rows without a usable overview.
/// 3. If nothing survives, retry up to maxAttempts times.
/// 4. Otherwise fetch the details for a random survivor and double-check
///    that the details row itself is still valid, retrying on failure.
Future<Map<String, dynamic>> pickRandomValidMedia({
  required FetchPage fetchPage,
  required FetchDetails fetchDetails,
  required int totalPages,
  required MediaType mediaType,
  List<dynamic> excludedItems = const [],
  int maxAttempts = Constants.maxGenerationAttempts,
}) async {
  final mt = resolveMediaTypeString(mediaType);

  for (var attempt = 0; attempt < maxAttempts; attempt++) {
    final page = getRandomPage(totalPages);
    final pageData = await fetchPage(page);
    final results = (pageData['results'] as List<dynamic>? ?? [])
        .map((e) => e as Map<String, dynamic>)
        .toList();

    final candidates = filterValidMedia(results, excludedItems, mediaType);

    if (candidates.isEmpty) continue;

    final candidate = getRandomMedia(candidates);
    final details = await fetchDetails(mt, candidate['id'] as int);

    if (hasValidDescription(details) &&
        !isExcludedForCurrentType(details['id'] as int, mt, excludedItems)) {
      return details;
    }
  }

  throw Exception('No content found. Try modifying the filters.');
}