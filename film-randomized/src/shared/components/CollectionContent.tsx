import { use, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { NormalizableItem } from '../utils/normalizeMediaItem.js';
import { matchesMediaListFilter } from '../utils/mediaUtils.js';
import { useCollectionItemsState } from '../hooks/useCollectionItemsState.js';
import CollectionStats from './CollectionStats.jsx';
import CollectionGrid from './CollectionGrid.jsx';
import CollectionEmptyState from './CollectionEmptyState.jsx';
import AppIcon from './AppIcon.jsx';
import type { CollectionCopy, CollectionFilter } from './collectionContent.types.js';

interface CollectionContentProps {
  itemsPromise: Promise<unknown>;
  filter: CollectionFilter;
  token: string | null;
  onRemove: (item: NormalizableItem, token: string) => Promise<void>;
  copy: CollectionCopy;
  onClearFilter: () => void;
}

function CollectionContent({
  itemsPromise,
  filter,
  token,
  onRemove,
  copy,
  onClearFilter,
}: CollectionContentProps) {
  const { t } = useTranslation();
  const initialItems = use(itemsPromise);
  const { items, handleRemove, removeError, clearRemoveError } = useCollectionItemsState({
    initialItems,
    token,
    onRemove,
  });

  const filtered = useMemo(
    () => items.filter((item) => matchesMediaListFilter(item, filter)),
    [items, filter]
  );

  if (filtered.length === 0) {
    return <CollectionEmptyState filter={filter} copy={copy} onClearFilter={onClearFilter} />;
  }

  return (
    <>
      {removeError && (
        <div
          className="mb-6 flex items-start justify-between gap-4 border-2 border-danger bg-white p-4 text-danger"
          role="alert"
        >
          <p className="text-sm font-semibold">{t(copy.removeErrorKey)}</p>
          <button
            type="button"
            onClick={clearRemoveError}
            className="ui-icon-button -my-2"
            aria-label={t(copy.dismissErrorKey)}
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>
      )}
      <CollectionStats count={filtered.length} copy={copy} />
      <CollectionGrid items={filtered} onRemove={handleRemove} />
    </>
  );
}

export default CollectionContent;
