import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/media_type.dart';
import '../services/tmdb_api.dart';
import '../services/discovered_api.dart';
import '../utils/pick_random_valid_media.dart';
import 'auth_provider.dart';
import 'exclusion_list_provider.dart';
import 'filter_provider.dart';

class MediaGeneratorState {
  final Map<String, dynamic>? randomMedia;
  final bool isLoading;
  final String? error;

  const MediaGeneratorState({
    this.randomMedia,
    this.isLoading = false,
    this.error,
  });
}

class MediaGeneratorNotifier extends StateNotifier<MediaGeneratorState> {
  final Ref _ref;

  MediaGeneratorNotifier(this._ref) : super(const MediaGeneratorState());

  Future<void> generateRandomMedia() async {
    state = const MediaGeneratorState(isLoading: true);
    try {
      final filterState = _ref.read(filterProvider);
      final auth = _ref.read(authProvider).valueOrNull;
      final token = auth?.token;

      // Load exclusion list (degrades silently)
      List<dynamic> excludedItems = [];
      try {
        final exclusion = await _ref.read(exclusionListProvider.future);
        excludedItems = exclusion;
      } catch (_) {
        // Silent degradation
      }

      // Discover media with current filters
      final discovery = await TmdbApi.discoverMedia(
        filterState.mediaType,
        filterState,
      );

      // Pick a random valid media item
      final details = await pickRandomValidMedia(
        fetchPage: (page) =>
            TmdbApi.fetchMediaPage(discovery.discoverUrl, page),
        fetchDetails: TmdbApi.fetchMediaDetails,
        totalPages: discovery.totalPages,
        mediaType: filterState.mediaType,
        excludedItems: excludedItems,
      );

      // Record to discovered (if authenticated)
      if (token != null) {
        try {
          final mediaTypeStr = filterState.mediaType == MediaType.movie
              ? 'movie'
              : 'tv';
          await DiscoveredApi.recordDiscovered(details, mediaTypeStr, token);
        } catch (e) {
          // Record-discovered failure: show error, do NOT show the result
          state = MediaGeneratorState(
            error: 'Failed to record discovered item',
          );
          return;
        }
      }

      state = MediaGeneratorState(randomMedia: details);
    } catch (e) {
      state = MediaGeneratorState(
        error: e.toString().replaceAll('Exception: ', ''),
      );
    }
  }
}

final mediaGeneratorProvider =
    StateNotifierProvider<MediaGeneratorNotifier, MediaGeneratorState>(
      (ref) => MediaGeneratorNotifier(ref),
    );
