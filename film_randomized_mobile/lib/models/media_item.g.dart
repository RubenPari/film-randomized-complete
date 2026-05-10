// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'media_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MediaItemImpl _$$MediaItemImplFromJson(Map<String, dynamic> json) =>
    _$MediaItemImpl(
      tmdbId: (json['tmdbId'] as num).toInt(),
      mediaType: $enumDecode(_$MediaTypeEnumMap, json['mediaType']),
      title: json['title'] as String,
      originalTitle: json['originalTitle'] as String?,
      overview: json['overview'] as String?,
      posterPath: json['posterPath'] as String?,
      backdropPath: json['backdropPath'] as String?,
      voteAverage: (json['voteAverage'] as num?)?.toDouble(),
      voteCount: (json['voteCount'] as num?)?.toInt(),
      releaseDate: json['releaseDate'] as String?,
      genres: json['genres'] as String?,
      runtime: (json['runtime'] as num?)?.toInt(),
      numberOfSeasons: (json['numberOfSeasons'] as num?)?.toInt(),
      numberOfEpisodes: (json['numberOfEpisodes'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$MediaItemImplToJson(_$MediaItemImpl instance) =>
    <String, dynamic>{
      'tmdbId': instance.tmdbId,
      'mediaType': _$MediaTypeEnumMap[instance.mediaType]!,
      'title': instance.title,
      'originalTitle': instance.originalTitle,
      'overview': instance.overview,
      'posterPath': instance.posterPath,
      'backdropPath': instance.backdropPath,
      'voteAverage': instance.voteAverage,
      'voteCount': instance.voteCount,
      'releaseDate': instance.releaseDate,
      'genres': instance.genres,
      'runtime': instance.runtime,
      'numberOfSeasons': instance.numberOfSeasons,
      'numberOfEpisodes': instance.numberOfEpisodes,
    };

const _$MediaTypeEnumMap = {MediaType.movie: 'movie', MediaType.tv: 'tv'};
