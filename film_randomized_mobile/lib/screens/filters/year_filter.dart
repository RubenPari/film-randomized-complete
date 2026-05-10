import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/filter_provider.dart';
import '../../theme/app_theme.dart';

class YearFilter extends ConsumerWidget {
  const YearFilter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(filterProvider);
    final notifier = ref.read(filterProvider.notifier);
    final currentYear = DateTime.now().year;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.calendar_today_outlined,
                size: 16, color: AppTheme.textBrand),
            const SizedBox(width: 6),
            Text('Release Year',
                style: TextStyle(
                    color: AppTheme.textBrand,
                    fontWeight: FontWeight.bold,
                    fontSize: 12)),
          ],
        ),
        const SizedBox(height: 4),
        const Text(
          'Choose a year range to limit the search.',
          style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'From',
                  isDense: true,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                controller:
                    TextEditingController(text: filter.releaseYearFrom.toString()),
                onChanged: (v) {
                  final year = int.tryParse(v);
                  if (year != null && year >= 1900 && year <= currentYear) {
                    notifier.setReleaseYearFrom(year);
                  }
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'To',
                  isDense: true,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                controller:
                    TextEditingController(text: filter.releaseYearTo.toString()),
                onChanged: (v) {
                  final year = int.tryParse(v);
                  if (year != null && year >= 1900 && year <= currentYear) {
                    notifier.setReleaseYearTo(year);
                  }
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
}