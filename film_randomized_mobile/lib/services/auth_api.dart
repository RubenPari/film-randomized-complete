import 'api_client.dart';

class AuthApi {
  AuthApi._();

  static Future<Map<String, dynamic>> login(
      String username, String password) async {
    return ApiClient().post('/auth/login', {
      'username': username,
      'password': password,
    });
  }

  static Future<Map<String, dynamic>> register(
      String username, String email, String password) async {
    return ApiClient().post('/auth/register', {
      'username': username,
      'email': email,
      'password': password,
    });
  }

  static Future<Map<String, dynamic>> me(String token) async {
    return ApiClient().get('/auth/me');
  }

  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    return ApiClient().post('/auth/forgot-password', {'email': email});
  }

  static Future<Map<String, dynamic>> resetPassword(
      String token, String newPassword) async {
    return ApiClient().post('/auth/reset-password', {
      'token': token,
      'newPassword': newPassword,
    });
  }

  static Future<Map<String, dynamic>> changePassword(
      String currentPassword, String newPassword, String token) async {
    return ApiClient().post('/auth/change-password', {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
  }
}