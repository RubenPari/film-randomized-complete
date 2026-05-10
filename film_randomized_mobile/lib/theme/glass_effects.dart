import 'dart:ui';
import 'package:flutter/material.dart';

/// Glass morphism decoration helpers matching the web's backdrop-blur-xl effects.
class GlassEffects {
  GlassEffects._();

  /// Standard glass card decoration (bg-slate-800/30 backdrop-blur-xl border-slate-700/50).
  static BoxDecoration card({Color? tintColor}) => BoxDecoration(
        color: tintColor ?? const Color(0x4D1e293b), // slate-800/30
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0x80334155), // slate-700/50
          width: 1,
        ),
      );

  /// Filter section decoration (bg-slate-800/40 backdrop-blur-xl rounded-2xl).
  static BoxDecoration filterSection({Color? tintColor}) => BoxDecoration(
        color: tintColor ?? const Color(0x661e293b), // slate-800/40
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0x80334155), // slate-700/50
          width: 1,
        ),
      );

  /// Auth form card decoration.
  static BoxDecoration authCard({Color? tintColor}) => BoxDecoration(
        color: tintColor ?? const Color(0x4D1e293b),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0x80334155),
          width: 1,
        ),
      );

  /// Media card decoration (bg-gradient-to-br from-slate-800/80 to-slate-900/80).
  static BoxDecoration mediaCard() => BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xCC1e293b), Color(0xCC0f172a)], // slate-800/80 → slate-900/80
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0x80334155),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 25,
            offset: const Offset(0, 12),
          ),
        ],
      );

  /// Creates a BackdropFilter widget with blur effect.
  static Widget blur({
    required Widget child,
    double sigmaX = 12,
    double sigmaY = 12,
    BorderRadius? borderRadius,
  }) {
    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: sigmaX, sigmaY: sigmaY),
        child: child,
      ),
    );
  }
}