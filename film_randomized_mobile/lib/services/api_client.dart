import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';

class ApiError implements Exception {
  final String message;
  final int? status;
  ApiError(this.message, [this.status]);

  @override
  String toString() => message;
}

class ApiClient {
  static final ApiClient _instance = ApiClient._();
  factory ApiClient() => _instance;
  ApiClient._() {
    _dio = Dio(BaseOptions(baseUrl: AppConfig.apiBaseUrl));
    _dio.interceptors.add(_authInterceptor);
  }

  late final Dio _dio;
  static const _secureStorage = FlutterSecureStorage();
  static const _tokenKey = 'auth_token';

  InterceptorsWrapper get _authInterceptor => InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _secureStorage.read(key: _tokenKey);
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          options.headers['Content-Type'] = 'application/json';
          handler.next(options);
        },
      );

  Future<Map<String, dynamic>> get(String endpoint) async {
    final response = await _dio.get<dynamic>(endpoint);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> post(
      String endpoint, Map<String, dynamic> body) async {
    final response = await _dio.post<dynamic>(endpoint, data: body);
    return _handleResponse(response);
  }

  Future<void> delete(String endpoint) async {
    final response = await _dio.delete<dynamic>(endpoint);
    if (response.statusCode != 204 && response.statusCode != 200) {
      throw ApiError('Delete failed', response.statusCode);
    }
  }

  Map<String, dynamic> _handleResponse(Response<dynamic> response) {
    if (response.statusCode == 204) return {};
    final data = response.data;
    if (data is Map<String, dynamic>) return data;
    return {};
  }
}