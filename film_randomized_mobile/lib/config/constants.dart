/// App-wide tuning values (single source for magic numbers).
class Constants {
  const Constants._();

  static const int overviewMaxLength = 280;
  static const int maxGenerationAttempts = 5;
  static const int minReleaseYear = 1900;

  /// TMDb discovery API caps reported total_pages at this value.
  static const int tmdbMaxPage = 500;

  /// Minimum vote-count presets (aligned with VoteCountFilter labels).
  static const List<int> voteCountThresholds = [0, 1000, 10000, 50000, 75000];
}