import 'package:flutter/material.dart';

/// Dark theme matching the web app's slate-950 / cyan-blue design system.
class AppTheme {
  AppTheme._();

  // Brand colors
  static const Color brandHighlight = Color(0xFF22d3ee); // cyan-400
  static const Color brandDeep = Color(0xFF3b82f6); // blue-500
  static const Color brandAccent = Color(0xFF06b6d4); // cyan-500

  // Background colors
  static const Color bgPrimary = Color(0xFF020617); // slate-950
  static const Color bgSecondary = Color(0xFF0f172a); // slate-900
  static const Color bgCard = Color(0xFF1e293b); // slate-800

  // Surface colors
  static const Color surfacePrimary = Color(0xFF1e293b); // slate-800
  static const Color surfaceBorder = Color(0x80334155); // slate-700/50

  // Text colors
  static const Color textPrimary = Color(0xFFF3F4F6); // gray-100
  static const Color textSecondary = Color(0xFF9CA3AF); // gray-400
  static const Color textBrand = Color(0xFF22d3ee); // cyan-400

  // Accent colors
  static const Color ratingStar = Color(0xFFf59e0b); // amber-500
  static const Color genreText = Color(0xFF67e8f9); // cyan-300
  static const Color genreBg = Color(0xB3384151); // slate-700/70

  static ThemeData get dark => ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: bgPrimary,
        colorScheme: const ColorScheme.dark(
          primary: brandAccent,
          secondary: brandDeep,
          surface: bgSecondary,
          error: Color(0xFFef4444),
          onPrimary: Colors.white,
          onSecondary: Colors.white,
          onSurface: textPrimary,
          onError: Colors.white,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          titleTextStyle: TextStyle(
            color: textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: IconThemeData(color: textPrimary),
        ),
        cardTheme: CardThemeData(
          color: surfacePrimary,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: surfaceBorder),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0x331e293b), // slate-800/20
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: surfaceBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: surfaceBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: brandAccent),
          ),
          labelStyle: const TextStyle(color: textSecondary),
          hintStyle: const TextStyle(color: Color(0xFF6B7280)), // gray-500
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: brandAccent,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: brandAccent,
          ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: bgSecondary,
          selectedItemColor: brandAccent,
          unselectedItemColor: textSecondary,
          type: BottomNavigationBarType.fixed,
          elevation: 0,
        ),
        sliderTheme: SliderThemeData(
          activeTrackColor: brandAccent,
          inactiveTrackColor: const Color(0xFF334155), // slate-700
          thumbColor: Colors.white,
          overlayColor: brandAccent.withOpacity(0.2),
        ),
        chipTheme: ChipThemeData(
          backgroundColor: const Color(0xB3384151), // slate-700/70
          selectedColor: brandAccent.withOpacity(0.3),
          labelStyle: const TextStyle(color: genreText),
          side: const BorderSide(color: surfaceBorder),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        dividerTheme: const DividerThemeData(
          color: surfaceBorder,
          thickness: 1,
        ),
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: CupertinoPageTransitionsBuilder(),
            TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          },
        ),
        useMaterial3: true,
      );
}