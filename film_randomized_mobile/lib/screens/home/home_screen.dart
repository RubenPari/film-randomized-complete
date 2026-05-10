import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/media_generator_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/error_banner.dart';
import '../../widgets/loading_spinner.dart';
import '../media_card/media_card.dart';
import 'home_header.dart';
import 'home_hero.dart';
import 'generate_button.dart';
import '../filters/filter_panel.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  bool _showFilters = true;
  final _filterDrawerKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    final generator = ref.watch(mediaGeneratorProvider);

    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: SafeArea(
        child: Column(
          children: [
            const HomeHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    const HomeHero(),
                    // Filter toggle on mobile
                    TextButton.icon(
                      onPressed: () =>
                          setState(() => _showFilters = !_showFilters),
                      icon: Icon(
                        _showFilters
                            ? Icons.filter_list_off
                            : Icons.filter_list,
                        color: AppTheme.brandAccent,
                      ),
                      label: Text(
                        _showFilters ? 'Hide filters' : 'Show filters',
                        style: const TextStyle(color: AppTheme.brandAccent),
                      ),
                    ),
                    if (_showFilters) ...[
                      const SizedBox(height: 12),
                      const FilterPanel(),
                    ],
                    const SizedBox(height: 20),
                    const GenerateButton(),
                    const SizedBox(height: 20),
                    // Error banner
                    if (generator.error != null)
                      ErrorBanner(message: generator.error!),
                    // Result area
                    if (generator.isLoading)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 40),
                        child: LoadingSpinner(label: 'Finding something great...'),
                      )
                    else if (generator.randomMedia != null)
                      MediaCard(media: generator.randomMedia!),
                    const SizedBox(height: 80), // Space for bottom nav
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}