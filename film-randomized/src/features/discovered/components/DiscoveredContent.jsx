import React, { useCallback } from 'react';
import CollectionContent from '../../../shared/components/CollectionContent.jsx';
import { removeDiscovered } from '../../../shared/services/discoveredApi.js';

const DISCOVERED_COPY = {
  totalItemsKey: 'discovered.totalItems',
  inListKey: 'discovered.inList',
  emptyIconPath:
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  emptyTitleKeys: {
    all: 'discovered.empty',
    movies: 'discovered.emptyMovies',
    tv: 'discovered.emptyTv',
  },
  emptyDescriptionAllKey: 'discovered.emptyDescription',
  emptyDescriptionFilterKey: 'watchlist.emptyFilterDescription',
  ctaLabelKey: 'discovered.generateMore',
};

/**
 * @param {Object} props
 * @param {Promise<Array<Object>>} props.discoveredPromise
 * @param {'all'|'movies'|'tv'} props.filter
 * @param {string} props.token
 */
function DiscoveredContent({ discoveredPromise, filter, token }) {
  const onRemove = useCallback(
    (item, authToken) =>
      removeDiscovered(item.media_type, item.tmdb_id, authToken),
    [],
  );

  return (
    <CollectionContent
      itemsPromise={discoveredPromise}
      filter={filter}
      token={token}
      onRemove={onRemove}
      copy={DISCOVERED_COPY}
    />
  );
}

export default DiscoveredContent;
