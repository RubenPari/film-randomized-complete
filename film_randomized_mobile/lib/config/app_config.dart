import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Backend API configuration.
class AppConfig {
  AppConfig._();

  /// Base URL for backend API (loaded from .env).
  static String get apiBaseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:8000/api';
}