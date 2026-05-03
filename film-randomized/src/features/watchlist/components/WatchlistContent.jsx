import React, { useCallback } from 'react';
import CollectionContent from '../../../shared/components/CollectionContent.jsx';
import { removeFromWatchlist } from '../../../shared/services/watchlistApi.js';

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

/**
 * @param {Object} props
 * @param {Promise<Array<Object>>} props.watchlistPromise
 * @param {'all'|'movies'|'tv'} props.filter
 * @param {string} props.token
 */
function WatchlistContent({ watchlistPromise, filter, token }) {
  const onRemove = useCallback(
    (item, authToken) => removeFromWatchlist(item.tmdb_id, authToken),
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
