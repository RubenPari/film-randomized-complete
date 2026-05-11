import { useCallback } from 'react';
import CollectionContent from '../../../shared/components/CollectionContent.jsx';
import { removeDiscovered } from '../../../shared/services/discoveredApi.js';
import type { MediaItem, MediaType } from '../../../shared/types/index.js';
import type { NormalizableItem } from '../../../shared/utils/normalizeMediaItem.js';

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

interface DiscoveredContentProps {
  discoveredPromise: Promise<MediaItem[]>;
  filter: 'all' | 'movies' | 'tv';
  token: string | null;
}

function DiscoveredContent({ discoveredPromise, filter, token }: DiscoveredContentProps) {
  const onRemove = useCallback(
    (item: NormalizableItem, authToken: string) =>
      removeDiscovered(item.media_type as MediaType, item.tmdb_id as number, authToken),
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
