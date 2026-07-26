import { useCallback } from 'react';
import CollectionContent from '../../../shared/components/CollectionContent.jsx';
import { removeDiscovered } from '../../../shared/services/discoveredApi.js';
import type { MediaItem, MediaType } from '../../../shared/types/index.js';
import type { NormalizableItem } from '../../../shared/utils/normalizeMediaItem.js';

const DISCOVERED_COPY = {
  totalItemsKey: 'discovered.totalItems',
  inListKey: 'discovered.inList',
  emptyIcon: 'seen' as const,
  emptyTitleKeys: {
    all: 'discovered.empty',
    movies: 'discovered.emptyMovies',
    tv: 'discovered.emptyTv',
  },
  emptyDescriptionAllKey: 'discovered.emptyDescription',
  emptyDescriptionFilterKey: 'discovered.emptyFilterDescription',
  ctaLabelKey: 'discovered.generateMore',
  singleItemLabelKey: 'discovered.item',
  multipleItemsLabelKey: 'discovered.items',
  removeErrorKey: 'collections.removeError',
  dismissErrorKey: 'collections.dismissError',
};

interface DiscoveredContentProps {
  discoveredPromise: Promise<MediaItem[]>;
  filter: 'all' | 'movies' | 'tv';
  token: string | null;
  onClearFilter: () => void;
}

function DiscoveredContent({
  discoveredPromise,
  filter,
  token,
  onClearFilter,
}: DiscoveredContentProps) {
  const onRemove = useCallback(
    (item: NormalizableItem, authToken: string) =>
      removeDiscovered(item.media_type as MediaType, item.tmdb_id as number, authToken),
    []
  );

  return (
    <CollectionContent
      itemsPromise={discoveredPromise}
      filter={filter}
      token={token}
      onRemove={onRemove}
      copy={DISCOVERED_COPY}
      onClearFilter={onClearFilter}
    />
  );
}

export default DiscoveredContent;
