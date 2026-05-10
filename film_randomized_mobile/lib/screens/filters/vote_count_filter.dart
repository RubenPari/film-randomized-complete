import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/constants.dart';
import '../../providers/filter_provider.dart';
import '../../theme/app_theme.dart';

class VoteCountFilter extends ConsumerWidget {
  const VoteCountFilter({super.key});

  static const _labels = ['All', '1,000+', '10,000+', '50,000+', '75,000+'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(filterProvider);
    final notifier = ref.read(filterProvider.notifier);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.how_to_vote_outlined,
                size: 16, color: AppTheme.textBrand),
            const SizedBox(width: 6),
            Text('Min Votes',
                style: TextStyle(
                    color: AppTheme.textBrand,
                    fontWeight: FontWeight.bold,
                    fontSize: 12)),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          children: List.generate(Constants.voteCountThresholds.length, (i) {
            final threshold = Constants.voteCountThresholds[i];
            final isActive = filter.minVoteCount == threshold;
            return ChoiceChip(
              label: Text(_labels[i]),
              selected: isActive,
              onSelected: (_) => notifier.setMinVoteCount(threshold),
              selectedColor: const Color(0xFF2563eb), // blue-600
              backgroundColor: const Color(0x801e293b), // slate-800/50
              labelStyle: TextStyle(
                color: isActive ? Colors.white : AppTheme.textSecondary,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              ),
            );
          }),
        ),
      ],
    );
  }
}