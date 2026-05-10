import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../theme/glass_effects.dart';
import 'media_type_selector.dart';
import 'rating_filter.dart';
import 'year_filter.dart';
import 'vote_count_filter.dart';
import 'genre_filter.dart';

class FilterPanel extends StatelessWidget {
  const FilterPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: GlassEffects.filterSection(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Media Type',
              style: TextStyle(
                  color: AppTheme.textBrand,
                  fontWeight: FontWeight.bold,
                  fontSize: 12)),
          const SizedBox(height: 12),
          const MediaTypeSelector(),
          const SizedBox(height: 20),
          const Divider(color: Color(0x33475569)),
          const SizedBox(height: 16),
          const RatingFilter(),
          const SizedBox(height: 16),
          const Divider(color: Color(0x33475569)),
          const SizedBox(height: 16),
          const YearFilter(),
          const SizedBox(height: 16),
          const Divider(color: Color(0x33475569)),
          const SizedBox(height: 16),
          const VoteCountFilter(),
          const SizedBox(height: 16),
          const Divider(color: Color(0x33475569)),
          const SizedBox(height: 16),
          const GenreFilter(),
        ],
      ),
    );
  }
}