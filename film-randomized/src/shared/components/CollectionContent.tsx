import { use, useMemo } from 'react';
import type { NormalizableItem } from '../utils/normalizeMediaItem.js';
import { matchesMediaListFilter } from '../utils/mediaUtils.js';
import { useCollectionItemsState } from '../hooks/useCollectionItemsState.js';
import CollectionStats from './CollectionStats.jsx';
import CollectionGrid from './CollectionGrid.jsx';
import CollectionEmptyState from './CollectionEmptyState.jsx';
import type { CollectionCopy, CollectionFilter } from './collectionContent.types.js';

interface CollectionContentProps {
  itemsPromise: Promise<unknown>;
  filter: CollectionFilter;
  token: string | null;
  onRemove: (item: NormalizableItem, token: string) => Promise<void>;
  copy: CollectionCopy;
}

function CollectionContent({ itemsPromise, filter, token, onRemove, copy }: CollectionContentProps) {
  const initialItems = use(itemsPromise);
  const { items, handleRemove } = useCollectionItemsState({
    initialItems,
    token,
    onRemove,
  });

  const filtered = useMemo(
    () => items.filter((item) => matchesMediaListFilter(item, filter)),
    [items, filter],
  );

  if (filtered.length === 0) {
    return <CollectionEmptyState filter={filter} copy={copy} />;
  }

  return (
    <>
      <CollectionStats count={filtered.length} copy={copy} />
      <CollectionGrid items={filtered} onRemove={handleRemove} />
    </>
  );
}

export default CollectionContent;
