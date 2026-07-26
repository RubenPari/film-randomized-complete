import { useTranslation } from 'react-i18next';
import { useFilterContext } from '../../context/FilterContext.jsx';
import MediaTypeSelector from './MediaTypeSelector.jsx';
import RatingFilter from './RatingFilter.jsx';
import YearFilter from './YearFilter.jsx';
import VoteCountFilter from './VoteCountFilter.jsx';
import GenreFilter from './GenreFilter.jsx';

function FilterPanel() {
  const { t } = useTranslation();
  const {
    mediaType,
    setMediaType,
    minRating,
    maxRating,
    setMinRating,
    setMaxRating,
    releaseYearFrom,
    releaseYearTo,
    setReleaseYearFrom,
    setReleaseYearTo,
    minVoteCount,
    setMinVoteCount,
    genres,
    selectedGenres,
    handleGenreToggle,
    resetFilters,
    isGenresLoading,
    genresError,
  } = useFilterContext();

  return (
    <div className="space-y-0">
      <div className="border-b-2 border-film-ink p-5">
        <MediaTypeSelector mediaType={mediaType} setMediaType={setMediaType} />
      </div>
      <div className="border-b-2 border-film-ink p-5">
        <RatingFilter
          minRating={minRating}
          maxRating={maxRating}
          setMinRating={setMinRating}
          setMaxRating={setMaxRating}
        />
      </div>
      <div className="border-b-2 border-film-ink p-5">
        <YearFilter
          releaseYearFrom={releaseYearFrom}
          releaseYearTo={releaseYearTo}
          setReleaseYearFrom={setReleaseYearFrom}
          setReleaseYearTo={setReleaseYearTo}
        />
      </div>
      <div className="border-b-2 border-film-ink p-5">
        <VoteCountFilter minVoteCount={minVoteCount} setMinVoteCount={setMinVoteCount} />
      </div>
      <div className="p-5">
        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          handleGenreToggle={handleGenreToggle}
          isLoading={isGenresLoading}
          error={genresError}
        />
      </div>
      <div className="sticky bottom-0 border-t-2 border-film-ink bg-film-screen p-5">
        <button
          type="button"
          onClick={resetFilters}
          className="ui-button ui-button--secondary w-full"
        >
          {t('filters.reset')}
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
