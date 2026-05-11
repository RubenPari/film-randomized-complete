import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LocaleNotifier extends StateNotifier<Locale> {
  static const _localeKey = 'app_locale';
  final _secureStorage = const FlutterSecureStorage();

  LocaleNotifier() : super(const Locale('en')) {
    _loadLocale();
  }

  Future<void> _loadLocale() async {
    final saved = await _secureStorage.read(key: _localeKey);
    if (saved != null && (saved == 'en' || saved == 'it')) {
      state = Locale(saved);
    }
  }

  Future<void> setLocale(String languageCode) async {
    state = Locale(languageCode);
    await _secureStorage.write(key: _localeKey, value: languageCode);
  }
}

final localeProvider =
    StateNotifierProvider<LocaleNotifier, Locale>(LocaleNotifier.new);