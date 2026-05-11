import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/api_config.dart';
import '../../theme/app_theme.dart';

class MediaCardPoster extends StatelessWidget {
  const MediaCardPoster({super.key, required this.posterPath, this.tmdbId, this.mediaType});
  final String? posterPath;
  final int? tmdbId;
  final String? mediaType;

  void _openTmdb() {
    if (tmdbId == null) return;
    final type = mediaType ?? 'movie';
    final url = 'https://www.themoviedb.org/$type/$tmdbId';
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;

    if (posterPath == null || posterPath!.isEmpty) {
      return AspectRatio(
        aspectRatio: 2 / 3,
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xCC1e293b),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.image_not_supported_outlined,
                  size: 40, color: AppTheme.textSecondary),
              const SizedBox(height: 8),
              Text(t.commonNoImage,
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
            ],
          ),
        ),
      );
    }

    return Column(
      children: [
        GestureDetector(
          onTap: _openTmdb,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: AspectRatio(
              aspectRatio: 2 / 3,
              child: CachedNetworkImage(
                imageUrl: '${ApiConfig.imageBaseUrl}$posterPath',
                fit: BoxFit.cover,
                placeholder: (context, url) => Shimmer.fromColors(
                  baseColor: const Color(0xFF1e293b),
                  highlightColor: const Color(0xFF334155),
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1e293b),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Container(
                  decoration: BoxDecoration(
                    color: const Color(0xCC1e293b),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.broken_image_outlined,
                          size: 40, color: AppTheme.textSecondary),
                      const SizedBox(height: 8),
                      Text(t.mediaImageUnavailable,
                          style:
                              const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        if (tmdbId != null)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: GestureDetector(
              onTap: _openTmdb,
              child: Text(
                t.mediaOnTmdb('TMDB'),
                style: const TextStyle(
                  color: AppTheme.brandAccent,
                  fontSize: 11,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ),
      ],
    );
  }
}