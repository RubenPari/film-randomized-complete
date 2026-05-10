import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../../config/api_config.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';

class CollectionItemCard extends StatelessWidget {
  const CollectionItemCard({
    super.key,
    required this.item,
    this.onRemove,
  });
  final Map<String, dynamic> item;
  final VoidCallback? onRemove;

  List<String> _parseGenres(dynamic genresRaw) {
    if (genresRaw == null) return [];
    if (genresRaw is String) {
      try {
        final parsed = jsonDecode(genresRaw) as List<dynamic>;
        return parsed
            .map((g) =>
                g is Map<String, dynamic> ? g['name'] as String : g.toString())
            .toList();
      } catch (_) {
        return [];
      }
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    final title = item['title'] ?? 'Unknown';
    final posterPath = item['poster_path'] as String?;
    final mediaType = item['media_type'] ?? item['mediaType'] ?? 'movie';
    final isMovie = mediaType == 'movie';
    final voteAverage = (item['vote_average'] as num?)?.toDouble() ?? 0.0;
    final releaseDate = item['release_date'] as String? ?? '';
    final year = releaseDate.isNotEmpty ? releaseDate.substring(0, 4) : '';
    final genres = _parseGenres(item['genres']);
    final tmdbId = item['tmdb_id'] ?? item['tmdbId'];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xCC1e293b),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0x80334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Poster with badges
          Expanded(
            child: Stack(
              children: [
                // Poster image
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16)),
                  child: posterPath != null
                      ? CachedNetworkImage(
                          imageUrl: '${ApiConfig.imageBaseUrl}$posterPath',
                          fit: BoxFit.cover,
                          width: double.infinity,
                          height: double.infinity,
                          placeholder: (context, url) => Shimmer.fromColors(
                            baseColor: const Color(0xFF1e293b),
                            highlightColor: const Color(0xFF334155),
                            child: Container(color: const Color(0xFF1e293b)),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: const Color(0xCC1e293b),
                            child: const Center(
                              child: Icon(Icons.image_not_supported_outlined,
                                  color: AppTheme.textSecondary, size: 32),
                            ),
                          ),
                        )
                      : Container(
                          color: const Color(0xCC1e293b),
                          child: const Center(
                            child: Icon(Icons.image_not_supported_outlined,
                                color: AppTheme.textSecondary, size: 32),
                          ),
                        ),
                ),
                // Media type badge (top right)
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      gradient: BrandGradients.primary,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      isMovie ? 'Movie' : 'TV',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                // Remove button (top left)
                if (onRemove != null)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: GestureDetector(
                      onTap: onRemove,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          gradient: BrandGradients.remove,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFef4444)
                                  .withValues(alpha: 0.3),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.close,
                            size: 16, color: Colors.white),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          // Info section
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.bold),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    if (year.isNotEmpty)
                      Text(year,
                          style: const TextStyle(
                              color: AppTheme.textSecondary, fontSize: 11)),
                    if (year.isNotEmpty && voteAverage > 0)
                      const SizedBox(width: 8),
                    if (voteAverage > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          gradient: BrandGradients.ratingBadge,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star,
                                size: 10, color: Colors.white),
                            const SizedBox(width: 2),
                            Text(voteAverage.toStringAsFixed(1),
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                  ],
                ),
                if (genres.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 4,
                    children: genres.take(2).map((name) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.genreBg,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(name,
                            style: const TextStyle(
                                color: AppTheme.genreText, fontSize: 9)),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}