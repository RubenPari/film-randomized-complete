import { useTranslation } from 'react-i18next';
import type { CollectionCopy } from './collectionContent.types.js';

interface CollectionStatsProps {
  count: number;
  copy: CollectionCopy;
}

function CollectionStats({ count, copy }: CollectionStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-7 flex items-end justify-between border-b-2 border-film-ink pb-4">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-film-ink/60">
          {t(copy.totalItemsKey)}
        </p>
        <p className="font-display text-5xl font-bold leading-none">{count}</p>
      </div>
      <p className="hidden font-mono text-xs font-semibold uppercase text-film-ink/60 md:block">
        {count} {count === 1 ? t(copy.singleItemLabelKey) : t(copy.multipleItemsLabelKey)}{' '}
        {t(copy.inListKey)}
      </p>
    </div>
  );
}

export default CollectionStats;
