import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CollectionCopy, CollectionFilter } from './collectionContent.types.js';

interface CollectionEmptyStateProps {
  filter: CollectionFilter;
  copy: CollectionCopy;
}

function CollectionEmptyState({ filter, copy }: CollectionEmptyStateProps) {
  const { t } = useTranslation();

  const titleKey =
    filter === 'all'
      ? copy.emptyTitleKeys.all
      : filter === 'movies'
        ? copy.emptyTitleKeys.movies
        : copy.emptyTitleKeys.tv;

  const description =
    filter === 'all'
      ? t(copy.emptyDescriptionAllKey)
      : t(copy.emptyDescriptionFilterKey, {
          type:
            filter === 'movies'
              ? t('common.movies').toLowerCase()
              : t('common.tvShows').toLowerCase(),
        });

  return (
    <div className="text-center py-24 px-6">
      <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
        <svg
          className="w-16 h-16 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={copy.emptyIconPath}
          />
        </svg>
      </div>
      <h2 className="text-slate-200 text-3xl font-bold mb-3">{t(titleKey)}</h2>
      <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">{description}</p>
      <Link
        to={copy.ctaTo ?? '/'}
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {t(copy.ctaLabelKey)}
      </Link>
    </div>
  );
}

export default CollectionEmptyState;
