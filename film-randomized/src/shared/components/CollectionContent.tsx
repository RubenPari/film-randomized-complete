import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  getMediaItemKey,
  normalizeMediaItem,
  NormalizableItem,
} from '../utils/normalizeMediaItem.js';
import { matchesMediaListFilter } from '../utils/mediaUtils.js';
import WatchlistItemCard from '../../features/watchlist/components/WatchlistItemCard.jsx';
import { MediaItem, MediaType } from '../types/index.js';

type CollectionFilter = 'all' | 'movies' | 'tv';

interface CollectionCopy {
  totalItemsKey: string;
  inListKey: string;
  emptyIconPath: string;
  emptyTitleKeys: {
    all: string;
    movies: string;
    tv: string;
  };
  emptyDescriptionAllKey: string;
  emptyDescriptionFilterKey: string;
  ctaLabelKey: string;
  ctaTo?: string;
}

interface CollectionContentProps {
  itemsPromise: Promise<unknown>;
  filter: 'all' | 'movies' | 'tv';
  token: string | null;
  onRemove: (item: NormalizableItem, token: string) => Promise<void>;
  copy: CollectionCopy;
}

function normalizeItems(items: unknown): NormalizableItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(normalizeMediaItem)
    .filter((item): item is NormalizableItem => !!item);
}

function CollectionContent({ itemsPromise, filter, token, onRemove, copy }: CollectionContentProps) {
  const { t } = useTranslation();
  const initialItems = use(itemsPromise) as NormalizableItem[];

  const [items, setItems] = useState<NormalizableItem[]>(() => normalizeItems(initialItems));

  useEffect(() => {
    setItems(normalizeItems(initialItems));
  }, [initialItems]);

  const itemsRef = useRef<NormalizableItem[]>(items);
  itemsRef.current = items;

  const handleRemove = useCallback(
    async (tmdbId: number, mediaType: MediaType) => {
      if (!token) return;

      const target: NormalizableItem = { tmdb_id: tmdbId, media_type: mediaType };
      const targetKey = getMediaItemKey(target);
      const snapshot = itemsRef.current;

      startTransition(() => {
        setItems((prev) =>
          prev.filter((item) => getMediaItemKey(item) !== targetKey),
        );
      });

      try {
        const original = snapshot.find(
          (item) => getMediaItemKey(item) === targetKey,
        );
        await onRemove(original ?? target, token);
      } catch (err: unknown) {
        startTransition(() => {
          setItems(snapshot);
        });
        console.error('Error removing collection item:', err);
      }
    },
    [token, onRemove],
  );

  const filtered = useMemo(
    () => items.filter((item) => matchesMediaListFilter(item, filter)),
    [items, filter],
  );

  if (filtered.length === 0) {
    return (
      <CollectionEmptyState
        t={t}
        filter={filter}
        copy={copy}
      />
    );
  }

  return (
    <>
      <div className="mb-8 px-6 py-4 rounded-2xl glass-effect border border-slate-700/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">
              {t(copy.totalItemsKey)}
            </p>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {filtered.length}
            </p>
          </div>
          <div className="hidden md:block text-slate-600">
            <p className="text-sm">
              {filtered.length}{' '}
              {filtered.length === 1 ? t('watchlist.item') : t('watchlist.items')}{' '}
              {t(copy.inListKey)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
        {filtered.map((item) => (
          <WatchlistItemCard
            key={getMediaItemKey(item)}
            item={item as MediaItem}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </>
  );
}

interface CollectionEmptyStateProps {
  t: TFunction;
  filter: CollectionFilter;
  copy: CollectionCopy;
}

function CollectionEmptyState({ t, filter, copy }: CollectionEmptyStateProps) {
  const titleKey =
    filter === 'all'
      ? copy.emptyTitleKeys.all
      : filter === 'movies'
        ? copy.emptyTitleKeys.movies
        : copy.emptyTitleKeys.tv;

  const description =
    filter === 'all'
      ? t(copy.emptyDescriptionAllKey)
      : t(copy.emptyDescriptionFilterKey, {
          type:
            filter === 'movies'
              ? t('common.movies').toLowerCase()
              : t('common.tvShows').toLowerCase(),
        });

  return (
    <div className="text-center py-24 px-6">
      <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
        <svg
          className="w-16 h-16 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={copy.emptyIconPath}
          />
        </svg>
      </div>
      <h2 className="text-slate-200 text-3xl font-bold mb-3">{t(titleKey)}</h2>
      <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">{description}</p>
      <Link
        to={copy.ctaTo ?? '/'}
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {t(copy.ctaLabelKey)}
      </Link>
    </div>
  );
}

export default CollectionContent;
