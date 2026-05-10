import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../theme/brand_gradients.dart';
import '../../services/watchlist_api.dart';

class SaveButtons extends ConsumerStatefulWidget {
  const SaveButtons({super.key, required this.media});
  final Map<String, dynamic> media;

  @override
  ConsumerState<SaveButtons> createState() => _SaveButtonsState();
}

class _SaveButtonsState extends ConsumerState<SaveButtons> {
  bool _isInWatchlist = false;
  bool _isLoading = true;
  bool _isSaving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _checkWatchlistStatus();
  }

  Future<void> _checkWatchlistStatus() async {
    final auth = ref.read(authProvider).valueOrNull;
    final token = auth?.token;
    if (token == null) {
      setState(() => _isLoading = false);
      return;
    }
    try {
      final tmdbId = widget.media['id'] as int;
      final isIn = await WatchlistApi.checkInWatchlist(tmdbId, token);
      if (mounted) {
        setState(() {
          _isInWatchlist = isIn;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _toggleWatchlist() async {
    final auth = ref.read(authProvider).valueOrNull;
    final token = auth?.token;
    if (token == null) return;

    setState(() {
      _isSaving = true;
      _error = null;
    });

    try {
      if (_isInWatchlist) {
        final tmdbId = widget.media['id'] as int;
        await WatchlistApi.removeFromWatchlist(tmdbId, token);
        setState(() => _isInWatchlist = false);
      } else {
        final mediaType = widget.media['media_type'] as String? ?? 'movie';
        await WatchlistApi.addToWatchlist(widget.media, mediaType, token);
        setState(() => _isInWatchlist = true);
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(strokeWidth: 2),
      );
    }

    return Column(
      children: [
        if (_error != null)
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0x4D7f1d1d),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.error_outline,
                  color: Color(0xFFef4444),
                  size: 16,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    _error!,
                    style: const TextStyle(
                      color: Color(0xFFfca5a5),
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: _isInWatchlist
                ? BrandGradients.saved
                : BrandGradients.primary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: ElevatedButton(
            onPressed: _isSaving ? null : _toggleWatchlist,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isSaving
                ? SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: _isInWatchlist ? Colors.white : Colors.white70,
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(_isInWatchlist ? Icons.check : Icons.add, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        _isInWatchlist ? 'In Watchlist' : 'Add to Watchlist',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ],
    );
  }
}
