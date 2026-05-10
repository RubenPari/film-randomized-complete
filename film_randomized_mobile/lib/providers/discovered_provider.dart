import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/discovered_api.dart';
import 'auth_provider.dart';

class DiscoveredNotifier
    extends StateNotifier<AsyncValue<List<Map<String, dynamic>>>> {
  final Ref _ref;
  DiscoveredNotifier(this._ref) : super(const AsyncLoading()) {
    _init();
  }

  Future<void> _init() async {
    final auth = _ref.read(authProvider).valueOrNull;
    if (auth?.token == null) {
      state = const AsyncData([]);
      return;
    }
    try {
      final items = await DiscoveredApi.getDiscovered(auth!.token!);
      state = AsyncData(items);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> record(
      Map<String, dynamic> media, String mediaType) async {
    final auth = _ref.read(authProvider).valueOrNull;
    if (auth?.token == null) return;
    try {
      await DiscoveredApi.recordDiscovered(media, mediaType, auth!.token!);
      await _init();
    } catch (_) {}
  }

  Future<bool> remove(String mediaType, int tmdbId) async {
    final auth = _ref.read(authProvider).valueOrNull;
    if (auth?.token == null) return false;
    try {
      await DiscoveredApi.removeDiscovered(mediaType, tmdbId, auth!.token!);
      await _init();
      return true;
    } catch (_) {
      return false;
    }
  }
}

final discoveredProvider =
    StateNotifierProvider<DiscoveredNotifier,
        AsyncValue<List<Map<String, dynamic>>>>(
  (ref) => DiscoveredNotifier(ref),
);