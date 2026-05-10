import 'package:flutter/material.dart';

/// Brand gradient constants matching the web CSS design system.
class BrandGradients {
  BrandGradients._();

  /// Primary brand gradient: cyan-500 → blue-500
  static const LinearGradient primary = LinearGradient(
    colors: [Color(0xFF06b6d4), Color(0xFF3b82f6)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  /// Brand highlight gradient: cyan-400 → blue-500
  static const LinearGradient highlight = LinearGradient(
    colors: [Color(0xFF22d3ee), Color(0xFF3b82f6)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  /// Title text gradient: cyan-300 → blue-300 → cyan-300 (shimmer)
  static const LinearGradient titleText = LinearGradient(
    colors: [Color(0xFF67e8f9), Color(0xFF93c5fd), Color(0xFF67e8f9)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  /// Rating badge gradient: amber-500 → orange-500
  static const LinearGradient ratingBadge = LinearGradient(
    colors: [Color(0xFFf59e0b), Color(0xFFf97316)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  /// Green "saved" gradient
  static const LinearGradient saved = LinearGradient(
    colors: [Color(0xFF22c55e), Color(0xFF16a34a)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  /// Remove button gradient: red-500 → red-600
  static const LinearGradient remove = LinearGradient(
    colors: [Color(0xFFef4444), Color(0xFFdc2626)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  /// Error gradient: red-900/30
  static const LinearGradient error = LinearGradient(
    colors: [Color(0xFF7f1d1d), Color(0xFF991b1b)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}