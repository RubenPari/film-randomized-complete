import 'package:freezed_annotation/freezed_annotation.dart';
import 'media_type.dart';

part 'media_item.freezed.dart';
part 'media_item.g.dart';

@freezed
class MediaItem with _$MediaItem {
  const factory MediaItem({
    required int tmdbId,
    required MediaType mediaType,
    required String title,
    String? originalTitle,
    String? overview,
    String? posterPath,
    String? backdropPath,
    double? voteAverage,
    int? voteCount,
    String? releaseDate,
    String? genres,
    int? runtime,
    int? numberOfSeasons,
    int? numberOfEpisodes,
  }) = _MediaItem;

  factory MediaItem.fromJson(Map<String, dynamic> json) =>
      _$MediaItemFromJson(json);
}