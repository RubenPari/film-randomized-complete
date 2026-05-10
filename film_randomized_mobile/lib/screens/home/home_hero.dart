import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../theme/brand_gradients.dart';

class HomeHero extends StatelessWidget {
  const HomeHero({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Column(
        children: [
          ShaderMask(
            shaderCallback: (bounds) =>
                BrandGradients.titleText.createShader(bounds),
            child: const Text(
              'Random Movie/TV Generator',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Discover random movies and TV shows based on your preferences. Filter by genre, year, and rating to find your next favorite entertainment.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}