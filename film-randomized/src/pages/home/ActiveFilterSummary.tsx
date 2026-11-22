import { useTranslation } from 'react-i18next';
import AppIcon from '../../shared/components/AppIcon.jsx';
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
    setMinRating,
    setMaxRating,
    setReleaseYearFrom,
    setReleaseYearTo,
    setMinVoteCount,
    handleGenreToggle,
  } = useFilterContext();
  const currentYear = new Date().getFullYear();

  // Single source for both the removable chips and the count.
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (minRating !== 0 || maxRating !== 10) {
    chips.push({
      key: 'rating',
      label: t('filters.ratingSummary', { min: minRating.toFixed(1), max: maxRating.toFixed(1) }),
      remove: () => {
        setMinRating(0);
        setMaxRating(10);
      },
    });
  }
  if (releaseYearFrom !== MIN_RELEASE_YEAR || releaseYearTo !== currentYear) {
    chips.push({
      key: 'years',
      label: t('filters.yearsSummary', { from: releaseYearFrom, to: releaseYearTo }),
      remove: () => {
        setReleaseYearFrom(MIN_RELEASE_YEAR);
        setReleaseYearTo(currentYear);
      },
    });
  }
  if (minVoteCount > 0) {
    chips.push({
      key: 'votes',
      label: t('filters.votesSummary', {
        value: new Intl.NumberFormat(i18n.resolvedLanguage).format(minVoteCount),
      }),
      remove: () => setMinVoteCount(0),
    });
  }
  if (selectedGenres.length > 0) {
    chips.push({
      key: 'genres',
      label: t('filters.genresSummary', { count: selectedGenres.length }),
      remove: () => selectedGenres.forEach(handleGenreToggle),
    });
  }

  return (
    <div
      className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
      aria-label={t('filters.applied')}
    >
      <span className="ui-chip bg-accent text-on-accent">
        {mediaType === 'movie' ? t('common.movies') : t('common.tvShows')}
      </span>
      {chips.map(({ key, label, remove }) => (
        <span key={key} className="ui-chip pr-1">
          {label}
          <button
            type="button"
            onClick={remove}
            className="inline-flex size-6 items-center justify-center rounded-full hover:bg-fg/15"
            aria-label={t('filters.removeChip', { filter: label })}
          >
            <AppIcon name="close" size={14} />
          </button>
        </span>
      ))}
      <span
        className="inline-flex size-8 items-center justify-center rounded-full bg-film-coral font-mono text-xs font-semibold text-fg"
        aria-label={t('filters.activeCount', { count: chips.length })}
      >
        {chips.length}
      </span>
    </div>
  );
};

export default ActiveFilterSummary;
