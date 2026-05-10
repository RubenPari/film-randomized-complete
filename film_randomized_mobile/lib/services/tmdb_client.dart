import 'package:dio/dio.dart';
import '../config/api_config.dart';

class TmdbError implements Exception {
  final String message;
  final int? status;
  TmdbError(this.message, [this.status]);

  @override
  String toString() => message;
}

class TmdbClient {
  static final TmdbClient _instance = TmdbClient._();
  factory TmdbClient() => _instance;
  TmdbClient._() {
    _dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl));
  }

  late final Dio _dio;
  String _language = 'en-US';

  void setLanguage(String locale) {
    _language = _mapLocale(locale);
  }

  String _mapLocale(String locale) {
    switch (locale) {
      case 'en':
        return 'en-US';
      case 'it':
        return 'it-IT';
      default:
        return '$locale-${locale.toUpperCase()}';
    }
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final response = await _dio.get<dynamic>(
        endpoint,
        queryParameters: {
          'api_key': ApiConfig.apiKey,
          'language': _language,
        },
      );
      final data = response.data;
      if (data is Map<String, dynamic>) return data;
      return {};
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      final message =
          e.response?.data?['status_message'] ?? e.message ?? 'TMDb API error';
      throw TmdbError(message, status);
    }
  }

  Future<Map<String, dynamic>> fetchRaw(String url,
      {Map<String, dynamic>? queryParams}) async {
    try {
      final response = await _dio.get<dynamic>(url,
          queryParameters: {
            'api_key': ApiConfig.apiKey,
            ...?queryParams,
          });
      final data = response.data;
      if (data is Map<String, dynamic>) return data;
      return {};
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      final message = e.message ?? 'TMDb API error';
      throw TmdbError(message, status);
    }
  }
}