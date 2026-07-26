import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppIcon from './AppIcon.jsx';
import type { CollectionCopy, CollectionFilter } from './collectionContent.types.js';

interface CollectionEmptyStateProps {
  filter: CollectionFilter;
  copy: CollectionCopy;
  onClearFilter: () => void;
}

function CollectionEmptyState({ filter, copy, onClearFilter }: CollectionEmptyStateProps) {
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
    <div className="ui-panel flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-24 items-center justify-center bg-film-yellow">
        <AppIcon name={copy.emptyIcon} size={56} />
      </span>
      <h2 className="mt-6 font-display text-4xl font-bold uppercase">{t(titleKey)}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-film-ink/65">{description}</p>
      {filter === 'all' ? (
        <Link to={copy.ctaTo ?? '/'} className="ui-button ui-button--primary mt-7">
          <AppIcon name="discover" />
          {t(copy.ctaLabelKey)}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClearFilter}
          className="ui-button ui-button--secondary mt-7"
        >
          {t('collections.showAll')}
        </button>
      )}
    </div>
  );
}

export default CollectionEmptyState;
