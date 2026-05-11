import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
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

  @override
  Widget build(BuildContext context) {
    final generator = ref.watch(mediaGeneratorProvider);
    final t = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      floatingActionButton: generator.isLoading
          ? FloatingActionButton(
              onPressed: null,
              backgroundColor: AppTheme.brandAccent.withOpacity(0.5),
              child: const CircularProgressIndicator(
                  strokeWidth: 2, color: Colors.white),
            )
          : FloatingActionButton.extended(
              onPressed: () =>
                  ref.read(mediaGeneratorProvider.notifier).generateRandomMedia(),
              backgroundColor: AppTheme.brandAccent,
              icon: const Icon(Icons.casino, color: Colors.white),
              label: Text(
                t.homeGenerate,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
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
                    TextButton.icon(
                      onPressed: () =>
                          setState(() => _showFilters = !_showFilters),
                      icon: Icon(
                        _showFilters ? Icons.filter_list_off : Icons.filter_list,
                        color: AppTheme.brandAccent,
                      ),
                      label: Text(
                        _showFilters ? t.homeHideFilters : t.homeShowFilters,
                        style: const TextStyle(color: AppTheme.brandAccent),
                      ),
                    ),
                    if (_showFilters) ...[
                      const SizedBox(height: 12),
                      const FilterPanel(),
                    ],
                    const SizedBox(height: 20),
                    if (generator.error != null)
                      ErrorBanner(message: generator.error!),
                    if (generator.isLoading)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        child: LoadingSpinner(label: t.homeLoading),
                      )
                    else if (generator.randomMedia != null)
                      MediaCard(media: generator.randomMedia!),
                    const SizedBox(height: 80),
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