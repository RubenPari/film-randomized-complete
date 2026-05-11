import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import '../../theme/app_theme.dart';

class MediaCardTrailer extends StatefulWidget {
  const MediaCardTrailer({super.key, required this.trailerKey});
  final String trailerKey;

  @override
  State<MediaCardTrailer> createState() => _MediaCardTrailerState();
}

class _MediaCardTrailerState extends State<MediaCardTrailer> {
  late final YoutubePlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = YoutubePlayerController(
      initialVideoId: widget.trailerKey,
      flags: const YoutubePlayerFlags(
        autoPlay: false,
        mute: false,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        Row(
          children: [
            const Icon(Icons.play_circle_outline,
                size: 18, color: AppTheme.textBrand),
            const SizedBox(width: 6),
            Text(t.commonTrailer,
                style: TextStyle(
                    color: AppTheme.textBrand,
                    fontWeight: FontWeight.bold,
                    fontSize: 14)),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: YoutubePlayer(
            controller: _controller,
            showVideoProgressIndicator: true,
            progressIndicatorColor: AppTheme.brandAccent,
          ),
        ),
      ],
    );
  }
}