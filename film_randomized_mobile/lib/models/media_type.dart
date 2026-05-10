/// Canonical media type identifiers.
enum MediaType {
  movie('movie'),
  tv('tv');

  const MediaType(this.value);
  final String value;

  /// Coerce a string to MediaType, defaults to movie.
  static MediaType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'tv':
        return MediaType.tv;
      default:
        return MediaType.movie;
    }
  }
}

/// Extension for convenience checks.
extension MediaTypeX on MediaType {
  bool get isMovie => this == MediaType.movie;
  bool get isTv => this == MediaType.tv;
}