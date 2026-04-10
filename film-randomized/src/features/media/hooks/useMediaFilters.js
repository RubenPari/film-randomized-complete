import { useState } from 'react';
import { MIN_RELEASE_YEAR } from '../../../shared/constants/config.js';

/**
 * Custom hook for managing filter states.
 */
export function useMediaFilters() {
  const [mediaType, setMediaType] = useState(true); // true = movie, false = TV show
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [releaseYearFrom, setReleaseYearFrom] = useState(MIN_RELEASE_YEAR);
  const [releaseYearTo, setReleaseYearTo] = useState(new Date().getFullYear());
  const [minVoteCount, setMinVoteCount] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]);

  /**
   * Toggles genre selection.
   * @param {number} genreId
   */
  const handleGenreToggle = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  return {
    mediaType,
    setMediaType,
    minRating,
    setMinRating,
    maxRating,
    setMaxRating,
    releaseYearFrom,
    setReleaseYearFrom,
    releaseYearTo,
    setReleaseYearTo,
    minVoteCount,
    setMinVoteCount,
    selectedGenres,
    handleGenreToggle,
  };
}
