import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_provider.dart';
import 'watchlist_provider.dart';
import 'discovered_provider.dart';

/// Computed provider: merges watchlist + discovered for the exclusion list.
/// Degrades silently on either failure (returns empty for that side).
final exclusionListProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final auth = ref.watch(authProvider).valueOrNull;
  if (auth?.token == null) return [];

  final watchlistAsync = ref.watch(watchlistProvider);
  final discoveredAsync = ref.watch(discoveredProvider);

  final watchlist = watchlistAsync.valueOrNull ?? [];
  final discovered = discoveredAsync.valueOrNull ?? [];

  return [...watchlist, ...discovered];
});