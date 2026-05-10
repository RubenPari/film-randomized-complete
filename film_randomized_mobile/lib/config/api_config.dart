import 'package:flutter_dotenv/flutter_dotenv.dart';

/// TMDb API configuration constants.
class ApiConfig {
  ApiConfig._();

  /// API key for accessing TMDb API (loaded from .env).
  static String get apiKey => dotenv.env['TMDB_API_KEY'] ?? '';

  /// Base URL for all TMDb API requests.
  static const String baseUrl = 'https://api.themoviedb.org/3';

  /// Base URL for TMDb image assets.
  static const String imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  /// API endpoint URLs and builders for TMDb API.
  static String get movieGenres => '$baseUrl/genre/movie/list';
  static String get tvGenres => '$baseUrl/genre/tv/list';
  static String discover(String mediaTypes) => '$baseUrl/discover/$mediaTypes';
  static String details(String mediaType, int id) => '$baseUrl/$mediaType/$id';
  static String videos(String mediaType, int id) => '$baseUrl/$mediaType/$id/videos';
}