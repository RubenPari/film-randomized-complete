import { useTranslation } from 'react-i18next';
import type { CollectionCopy } from './collectionContent.types.js';

interface CollectionStatsProps {
  count: number;
  copy: CollectionCopy;
}

function CollectionStats({ count, copy }: CollectionStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 px-6 py-4 rounded-2xl glass-effect border border-slate-700/50">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">
            {t(copy.totalItemsKey)}
          </p>
          <p className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            {count}
          </p>
        </div>
        <div className="hidden md:block text-slate-600">
          <p className="text-sm">
            {count}{' '}
            {count === 1
              ? t(copy.singleItemLabelKey)
              : t(copy.multipleItemsLabelKey)}{' '}
            {t(copy.inListKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CollectionStats;
