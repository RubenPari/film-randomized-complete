import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/auth_state.dart';
import '../models/user.dart';
import '../services/auth_api.dart';

class AuthNotifier extends AsyncNotifier<AuthState> {
  static const _tokenKey = 'auth_token';
  final _secureStorage = const FlutterSecureStorage();

  @override
  AuthState build() {
    _init();
    return const AuthState();
  }

  Future<void> _init() async {
    final token = await _secureStorage.read(key: _tokenKey);
    if (token == null) {
      state = const AsyncData(AuthState());
      return;
    }
    try {
      final userMap = await AuthApi.me(token);
      final user = User.fromJson(userMap);
      await _setAuth(user, token);
    } catch (_) {
      await _secureStorage.delete(key: _tokenKey);
      state = const AsyncData(AuthState());
    }
  }

  Future<void> login(String username, String password) async {
    state = const AsyncData(AuthState(isLoading: true));
    try {
      final response = await AuthApi.login(username, password);
      final token = response['token'] as String;
      final user = User.fromJson(response['user'] as Map<String, dynamic>);
      await _secureStorage.write(key: _tokenKey, value: token);
      await _setAuth(user, token);
    } catch (e) {
      state = AsyncData(AuthState(error: e.toString()));
    }
  }

  Future<void> register(
      String username, String email, String password) async {
    state = const AsyncData(AuthState(isLoading: true));
    try {
      final response = await AuthApi.register(username, email, password);
      final token = response['token'] as String;
      final user = User.fromJson(response['user'] as Map<String, dynamic>);
      await _secureStorage.write(key: _tokenKey, value: token);
      await _setAuth(user, token);
    } catch (e) {
      state = AsyncData(AuthState(error: e.toString()));
    }
  }

  Future<void> logout() async {
    await _secureStorage.delete(key: _tokenKey);
    state = const AsyncData(AuthState());
  }

  Future<String?> forgotPassword(String email) async {
    try {
      await AuthApi.forgotPassword(email);
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> resetPassword(String token, String newPassword) async {
    try {
      await AuthApi.resetPassword(token, newPassword);
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> changePassword(
      String currentPassword, String newPassword) async {
    try {
      final token = state.value?.token;
      if (token == null) return 'Not authenticated';
      await AuthApi.changePassword(currentPassword, newPassword, token);
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<void> _setAuth(User user, String token) async {
    state = AsyncData(AuthState(user: user, token: token));
  }
}

final authProvider =
    AsyncNotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);