import { useTranslation } from 'react-i18next';
import { useFilterContext } from '../../features/media/context/FilterContext.jsx';
import { MIN_RELEASE_YEAR } from '../../shared/constants/config.js';

const ActiveFilterSummary = () => {
  const { t, i18n } = useTranslation();
  const {
    mediaType,
    minRating,
    maxRating,
    releaseYearFrom,
    releaseYearTo,
    minVoteCount,
    selectedGenres,
  } = useFilterContext();
  const currentYear = new Date().getFullYear();
  const changedCategories = [
    minRating !== 0 || maxRating !== 10,
    releaseYearFrom !== MIN_RELEASE_YEAR || releaseYearTo !== currentYear,
    minVoteCount > 0,
    selectedGenres.length > 0,
  ].filter(Boolean).length;

  return (
    <div
      className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
      aria-label={t('filters.applied')}
    >
      <span className="ui-chip bg-film-yellow">
        {mediaType === 'movie' ? t('common.movies') : t('common.tvShows')}
      </span>
      {(minRating !== 0 || maxRating !== 10) && (
        <span className="ui-chip">
          {t('filters.ratingSummary', {
            min: minRating.toFixed(1),
            max: maxRating.toFixed(1),
          })}
        </span>
      )}
      {(releaseYearFrom !== MIN_RELEASE_YEAR || releaseYearTo !== currentYear) && (
        <span className="ui-chip">
          {t('filters.yearsSummary', { from: releaseYearFrom, to: releaseYearTo })}
        </span>
      )}
      {minVoteCount > 0 && (
        <span className="ui-chip">
          {t('filters.votesSummary', {
            value: new Intl.NumberFormat(i18n.resolvedLanguage).format(minVoteCount),
          })}
        </span>
      )}
      {selectedGenres.length > 0 && (
        <span className="ui-chip">
          {t('filters.genresSummary', { count: selectedGenres.length })}
        </span>
      )}
      <span
        className="inline-flex size-8 items-center justify-center rounded-full bg-film-coral font-mono text-xs font-semibold text-film-ink"
        aria-label={t('filters.activeCount', { count: changedCategories })}
      >
        {changedCategories}
      </span>
    </div>
  );
};

export default ActiveFilterSummary;
