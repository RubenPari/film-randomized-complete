import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../config/constants.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';

class MediaCardInfo extends StatefulWidget {
  const MediaCardInfo({super.key, required this.media});
  final Map<String, dynamic> media;

  @override
  State<MediaCardInfo> createState() => _MediaCardInfoState();
}

class _MediaCardInfoState extends State<MediaCardInfo> {
  bool _showFullOverview = false;

  List<String> _parseGenres(dynamic genresRaw) {
    if (genresRaw == null) return [];
    if (genresRaw is String) {
      try {
        final parsed = jsonDecode(genresRaw) as List<dynamic>;
        return parsed
            .map((g) => g is Map<String, dynamic> ? g['name'] as String : g.toString())
            .toList();
      } catch (_) {
        return [];
      }
    }
    if (genresRaw is List) {
      return genresRaw
          .map((g) => g is Map ? g['name'] as String : g.toString())
          .toList();
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    final media = widget.media;
    final t = AppLocalizations.of(context)!;
    final title = media['title'] ?? media['name'] ?? t.commonUnknown;
    final overview = media['overview'] as String? ?? '';
    final voteAverage = (media['vote_average'] as num?)?.toDouble() ?? 0.0;
    final releaseDate = media['release_date'] as String? ??
        media['first_air_date'] as String? ??
        '';
    final year = releaseDate.isNotEmpty ? releaseDate.substring(0, 4) : '';
    final genres = _parseGenres(media['genres']);
    final isTruncated = overview.length > Constants.overviewMaxLength;
    final displayOverview = _showFullOverview
        ? overview
        : (isTruncated
            ? '${overview.substring(0, Constants.overviewMaxLength)}...'
            : overview);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title with gradient
        ShaderMask(
          shaderCallback: (bounds) =>
              BrandGradients.titleText.createShader(bounds),
          child: Text(
            year.isNotEmpty ? '$title ($year)' : title,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
        ),
        const SizedBox(height: 12),
        // Rating badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            gradient: BrandGradients.ratingBadge,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFf59e0b).withValues(alpha: 0.3),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.star, size: 14, color: Colors.white),
              const SizedBox(width: 4),
              Text(
                '${voteAverage.toStringAsFixed(1)}/10',
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Genre badges (up to 3)
        if (genres.isNotEmpty)
          Wrap(
            spacing: 6,
            children: genres.take(3).map((name) {
              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.genreBg,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: const Color(0x80475569)), // slate-600/50
                ),
                child: Text(name,
                    style: const TextStyle(
                        color: AppTheme.genreText, fontSize: 11)),
              );
            }).toList(),
          ),
        const SizedBox(height: 12),
        // Overview
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0x331e293b), // slate-800/20
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0x33475569)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                displayOverview,
                style: const TextStyle(
                    color: AppTheme.textPrimary, fontSize: 14, height: 1.5),
              ),
              if (isTruncated)
                TextButton(
                  onPressed: () =>
                      setState(() => _showFullOverview = !_showFullOverview),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.only(top: 4),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: Text(
                    _showFullOverview ? t.commonShowLess : t.commonShowMore,
                    style: const TextStyle(
                        color: AppTheme.brandAccent, fontSize: 13),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}