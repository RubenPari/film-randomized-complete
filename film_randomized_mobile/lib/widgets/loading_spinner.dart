import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class LoadingSpinner extends StatelessWidget {
  const LoadingSpinner({super.key, this.size = 32, this.label});
  final double size;
  final String? label;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CircularProgressIndicator(
            strokeWidth: 4,
            valueColor: AlwaysStoppedAnimation(AppTheme.brandAccent),
          ),
        ),
        if (label != null) ...[
          const SizedBox(height: 12),
          Text(
            label!,
            style: const TextStyle(color: AppTheme.textSecondary),
          ),
        ],
      ],
    );
  }
}