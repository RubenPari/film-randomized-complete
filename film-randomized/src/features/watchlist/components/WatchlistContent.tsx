import { useCallback } from 'react';
import CollectionContent from '../../../shared/components/CollectionContent.jsx';
import { removeFromWatchlist } from '../../../shared/services/watchlistApi.js';
import type { MediaItem } from '../../../shared/types/index.js';
import type { NormalizableItem } from '../../../shared/utils/normalizeMediaItem.js';

const WATCHLIST_COPY = {
  totalItemsKey: 'watchlist.totalItems',
  inListKey: 'watchlist.inList',
  emptyIconPath:
    'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  emptyTitleKeys: {
    all: 'watchlist.empty',
    movies: 'watchlist.emptyMovies',
    tv: 'watchlist.emptyTv',
  },
  emptyDescriptionAllKey: 'watchlist.emptyDescription',
  emptyDescriptionFilterKey: 'watchlist.emptyFilterDescription',
  ctaLabelKey: 'watchlist.discoverContent',
};

interface WatchlistContentProps {
  watchlistPromise: Promise<MediaItem[]>;
  filter: 'all' | 'movies' | 'tv';
  token: string | null;
}

function WatchlistContent({ watchlistPromise, filter, token }: WatchlistContentProps) {
  const onRemove = useCallback(
    (item: NormalizableItem, authToken: string) => removeFromWatchlist(item.tmdb_id as number, authToken),
    [],
  );

  return (
    <CollectionContent
      itemsPromise={watchlistPromise}
      filter={filter}
      token={token}
      onRemove={onRemove}
      copy={WATCHLIST_COPY}
    />
  );
}

export default WatchlistContent;
