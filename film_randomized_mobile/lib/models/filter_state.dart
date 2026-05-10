import 'package:freezed_annotation/freezed_annotation.dart';
import 'media_type.dart';

part 'filter_state.freezed.dart';

@freezed
class FilterState with _$FilterState {
  const factory FilterState({
    @Default(MediaType.movie) MediaType mediaType,
    @Default(0.0) double minRating,
    @Default(10.0) double maxRating,
    @Default(1900) int releaseYearFrom,
    @Default(2026) int releaseYearTo,
    @Default(0) int minVoteCount,
    @Default([]) List<int> selectedGenres,
  }) = _FilterState;
}