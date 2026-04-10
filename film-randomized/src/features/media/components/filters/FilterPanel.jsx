/**
 * Filter panel component.
 * Contains all filter controls for media generation.
 */
import React from 'react';
import { useFilterContext } from '../../context/FilterContext.jsx';
import MediaTypeSelector from './MediaTypeSelector.jsx';
import RatingFilter from './RatingFilter.jsx';
import YearFilter from './YearFilter.jsx';
import VoteCountFilter from './VoteCountFilter.jsx';
import GenreFilter from './GenreFilter.jsx';

/**
 * Filter panel — reads state from {@link useFilterContext} (no props).
 */
function FilterPanel() {
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
  } = useFilterContext();
  return (
    <div className="space-y-6">
      <div className="filter-section">
        <MediaTypeSelector mediaType={mediaType} setMediaType={setMediaType} />
      </div>

      <div className="filter-section">
        <RatingFilter
          minRating={minRating}
          maxRating={maxRating}
          setMinRating={setMinRating}
          setMaxRating={setMaxRating}
        />
      </div>

      <div className="filter-section">
        <YearFilter
          releaseYearFrom={releaseYearFrom}
          releaseYearTo={releaseYearTo}
          setReleaseYearFrom={setReleaseYearFrom}
          setReleaseYearTo={setReleaseYearTo}
        />
      </div>

      <div className="filter-section">
        <VoteCountFilter minVoteCount={minVoteCount} setMinVoteCount={setMinVoteCount} />
      </div>

      <div className="filter-section">
        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          handleGenreToggle={handleGenreToggle}
        />
      </div>
    </div>
  );
}

export default FilterPanel;
