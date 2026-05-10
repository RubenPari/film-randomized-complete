import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/filter_state.dart';
import '../models/media_type.dart';

class FilterNotifier extends Notifier<FilterState> {
  @override
  FilterState build() {
    return FilterState(releaseYearTo: DateTime.now().year);
  }

  void setMediaType(MediaType type) =>
      state = state.copyWith(mediaType: type);
  void setMinRating(double value) => state = state.copyWith(minRating: value);
  void setMaxRating(double value) => state = state.copyWith(maxRating: value);
  void setReleaseYearFrom(int year) =>
      state = state.copyWith(releaseYearFrom: year);
  void setReleaseYearTo(int year) =>
      state = state.copyWith(releaseYearTo: year);
  void setMinVoteCount(int count) =>
      state = state.copyWith(minVoteCount: count);

  void toggleGenre(int genreId) {
    final genres = List<int>.from(state.selectedGenres);
    if (genres.contains(genreId)) {
      genres.remove(genreId);
    } else {
      genres.add(genreId);
    }
    state = state.copyWith(selectedGenres: genres);
  }
}

final filterProvider =
    NotifierProvider<FilterNotifier, FilterState>(FilterNotifier.new);