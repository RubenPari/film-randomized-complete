import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/watchlist_api.dart';
import 'auth_provider.dart';

class WatchlistNotifier
    extends StateNotifier<AsyncValue<List<Map<String, dynamic>>>> {
  final Ref _ref;
  WatchlistNotifier(this._ref) : super(const AsyncLoading()) {
    _init();
  }

  Future<void> _init() async {
    final auth = _ref.read(authProvider).valueOrNull;
    if (auth?.token == null) {
      state = const AsyncData([]);
      return;
    }
    try {
      final items = await WatchlistApi.getWatchlist(auth!.token!);
      state = AsyncData(items);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> add(Map<String, dynamic> media, String mediaType) async {
    final auth = _ref.read(authProvider).valueOrNull;
    if (auth?.token == null) return;
    try {
      await WatchlistApi.addToWatchlist(media, mediaType, auth!.token!);
      await _init();
    } catch (_) {}
  }

  Future<bool> remove(int tmdbId) async {
    final auth = _ref.read(authProvider).valueOrNull;
    if (auth?.token == null) return false;
    try {
      await WatchlistApi.removeFromWatchlist(tmdbId, auth!.token!);
      await _init();
      return true;
    } catch (_) {
      return false;
    }
  }
}

final watchlistProvider =
    StateNotifierProvider<
      WatchlistNotifier,
      AsyncValue<List<Map<String, dynamic>>>
    >((ref) => WatchlistNotifier(ref));
