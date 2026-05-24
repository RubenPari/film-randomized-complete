import CollectionItemCard from './CollectionItemCard.jsx';
import { getMediaItemKey } from '../utils/normalizeMediaItem.js';
import type { MediaItem, MediaType } from '../types/index.js';
import type { NormalizableItem } from '../utils/normalizeMediaItem.js';

interface CollectionGridProps {
  items: NormalizableItem[];
  onRemove: (tmdbId: number, mediaType: MediaType) => Promise<void>;
}

function CollectionGrid({ items, onRemove }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
      {items.map((item) => (
        <CollectionItemCard
          key={getMediaItemKey(item)}
          item={item as MediaItem}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CollectionGrid;
