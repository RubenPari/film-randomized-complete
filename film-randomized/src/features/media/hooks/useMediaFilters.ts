import { useState } from 'react';
import { MIN_RELEASE_YEAR } from '../../../shared/constants/config.js';
import type { MediaType } from '../../../shared/types/index.js';

export interface UseMediaFiltersReturn {
  mediaType: MediaType;
  setMediaType: (val: MediaType) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  maxRating: number;
  setMaxRating: (val: number) => void;
  releaseYearFrom: number;
  setReleaseYearFrom: (val: number) => void;
  releaseYearTo: number;
  setReleaseYearTo: (val: number) => void;
  minVoteCount: number;
  setMinVoteCount: (val: number) => void;
  selectedGenres: number[];
  handleGenreToggle: (genreId: number) => void;
}

/**
 * Custom hook for managing filter states.
 */
export function useMediaFilters(): UseMediaFiltersReturn {
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRating, setMaxRating] = useState<number>(10);
  const [releaseYearFrom, setReleaseYearFrom] = useState<number>(MIN_RELEASE_YEAR);
  const [releaseYearTo, setReleaseYearTo] = useState<number>(new Date().getFullYear());
  const [minVoteCount, setMinVoteCount] = useState<number>(0);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  /**
   * Toggles genre selection.
   */
  const handleGenreToggle = (genreId: number) => {
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
