import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../utils/media_utils.dart';
import '../../utils/normalize_media_item.dart';
import 'collection_item_card.dart';
import 'collection_empty_state.dart';

class CollectionContent extends StatefulWidget {
  const CollectionContent({
    super.key,
    required this.items,
    required this.onRemove,
    required this.emptyIcon,
    required this.emptyTitle,
    required this.emptyDescription,
    required this.emptyCtaLabel,
    required this.emptyFilterTitle,
  });

  final List<Map<String, dynamic>> items;
  final Future<bool> Function(Map<String, dynamic> item) onRemove;
  final IconData emptyIcon;
  final String emptyTitle;
  final String emptyDescription;
  final String emptyCtaLabel;
  final String Function(String filter) emptyFilterTitle;

  @override
  State<CollectionContent> createState() => _CollectionContentState();
}

class _CollectionContentState extends State<CollectionContent> {
  String _filter = 'all';
  late List<Map<String, dynamic>> _displayItems;

  @override
  void initState() {
    super.initState();
    _displayItems = widget.items;
  }

  @override
  void didUpdateWidget(covariant CollectionContent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.items != widget.items) {
      _displayItems = widget.items;
    }
  }

  List<Map<String, dynamic>> get _filteredItems {
    return _displayItems
        .where((item) => matchesMediaListFilter(item, _filter))
        .toList();
  }

  Future<void> _handleRemove(Map<String, dynamic> item) async {
    // Optimistic removal: take snapshot, remove item, try API, revert on failure
    final snapshot = List<Map<String, dynamic>>.from(_displayItems);
    final key = getMediaItemKey(item);

    setState(() {
      _displayItems =
          _displayItems.where((i) => getMediaItemKey(i) != key).toList();
    });

    final success = await widget.onRemove(item);
    if (!success && mounted) {
      setState(() => _displayItems = snapshot);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredItems;

    return Column(
      children: [
        // Filter tabs
        Row(
          children: [
            _FilterChip(
                label: 'All',
                isActive: _filter == 'all',
                onTap: () => setState(() => _filter = 'all')),
            const SizedBox(width: 8),
            _FilterChip(
                label: 'Movies',
                isActive: _filter == 'movies',
                onTap: () => setState(() => _filter = 'movies')),
            const SizedBox(width: 8),
            _FilterChip(
                label: 'TV Shows',
                isActive: _filter == 'tv',
                onTap: () => setState(() => _filter = 'tv')),
          ],
        ),
        const SizedBox(height: 16),
        // Stats
        Text(
          '${filtered.length} ${filtered.length == 1 ? 'item' : 'items'} in list',
          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
        ),
        const SizedBox(height: 16),
        // Grid or empty state
        if (filtered.isEmpty)
          Expanded(
            child: CollectionEmptyState(
              icon: widget.emptyIcon,
              title: _filter == 'all'
                  ? widget.emptyTitle
                  : widget.emptyFilterTitle(_filter),
              description: widget.emptyDescription,
              ctaLabel: widget.emptyCtaLabel,
            ),
          )
        else
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.55,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final item = filtered[index];
                return CollectionItemCard(
                  item: item,
                  onRemove: () => _handleRemove(item),
                );
              },
            ),
          ),
      ],
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip(
      {required this.label, required this.isActive, required this.onTap});
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.brandAccent.withValues(alpha: 0.2)
              : const Color(0x331e293b),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive
                ? AppTheme.brandAccent
                : const Color(0x80334155),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? AppTheme.brandAccent : AppTheme.textSecondary,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}