import { useCallback } from 'react';
import CollectionContent from '../../../shared/components/CollectionContent.jsx';
import { removeFromWatchlist } from '../../../shared/services/watchlistApi.js';
import type { MediaItem } from '../../../shared/types/index.js';
import type { NormalizableItem } from '../../../shared/utils/normalizeMediaItem.js';

const WATCHLIST_COPY = {
  totalItemsKey: 'watchlist.totalItems',
  inListKey: 'watchlist.inList',
  emptyIcon: 'watchlist' as const,
  emptyTitleKeys: {
    all: 'watchlist.empty',
    movies: 'watchlist.emptyMovies',
    tv: 'watchlist.emptyTv',
  },
  emptyDescriptionAllKey: 'watchlist.emptyDescription',
  emptyDescriptionFilterKey: 'watchlist.emptyFilterDescription',
  ctaLabelKey: 'watchlist.discoverContent',
  singleItemLabelKey: 'watchlist.item',
  multipleItemsLabelKey: 'watchlist.items',
  removeErrorKey: 'collections.removeError',
  dismissErrorKey: 'collections.dismissError',
};

interface WatchlistContentProps {
  watchlistPromise: Promise<MediaItem[]>;
  filter: 'all' | 'movies' | 'tv';
  token: string | null;
  onClearFilter: () => void;
}

function WatchlistContent({
  watchlistPromise,
  filter,
  token,
  onClearFilter,
}: WatchlistContentProps) {
  const onRemove = useCallback(
    (item: NormalizableItem, authToken: string) =>
      removeFromWatchlist(item.tmdb_id as number, authToken),
    []
  );

  return (
    <CollectionContent
      itemsPromise={watchlistPromise}
      filter={filter}
      token={token}
      onRemove={onRemove}
      copy={WATCHLIST_COPY}
      onClearFilter={onClearFilter}
    />
  );
}

export default WatchlistContent;
