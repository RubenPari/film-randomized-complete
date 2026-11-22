import { useEffect, useState } from 'react';
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
  resetFilters: () => void;
}

export const FILTERS_STORAGE_KEY = 'film-randomized.filters';

const defaults = () => ({
  mediaType: 'movie' as MediaType,
  minRating: 0,
  maxRating: 10,
  releaseYearFrom: MIN_RELEASE_YEAR,
  releaseYearTo: new Date().getFullYear(),
  minVoteCount: 0,
  selectedGenres: [] as number[],
});

type StoredFilters = ReturnType<typeof defaults>;

/** Reads saved filters; any missing, corrupt or wrongly typed field falls back to its default. */
function loadFilters(): StoredFilters {
  const base = defaults();
  try {
    const raw = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY) ?? 'null');
    if (!raw || typeof raw !== 'object') return base;
    const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
    return {
      mediaType:
        raw.mediaType === 'tv' || raw.mediaType === 'movie' ? raw.mediaType : base.mediaType,
      minRating: num(raw.minRating, base.minRating),
      maxRating: num(raw.maxRating, base.maxRating),
      releaseYearFrom: num(raw.releaseYearFrom, base.releaseYearFrom),
      releaseYearTo: num(raw.releaseYearTo, base.releaseYearTo),
      minVoteCount: num(raw.minVoteCount, base.minVoteCount),
      selectedGenres: Array.isArray(raw.selectedGenres)
        ? raw.selectedGenres.filter((g: unknown) => typeof g === 'number')
        : base.selectedGenres,
    };
  } catch {
    return base;
  }
}

/**
 * Custom hook for managing filter states, persisted to localStorage.
 */
export function useMediaFilters(): UseMediaFiltersReturn {
  const [initial] = useState(loadFilters);
  const [mediaType, setMediaType] = useState<MediaType>(initial.mediaType);
  const [minRating, setMinRating] = useState<number>(initial.minRating);
  const [maxRating, setMaxRating] = useState<number>(initial.maxRating);
  const [releaseYearFrom, setReleaseYearFrom] = useState<number>(initial.releaseYearFrom);
  const [releaseYearTo, setReleaseYearTo] = useState<number>(initial.releaseYearTo);
  const [minVoteCount, setMinVoteCount] = useState<number>(initial.minVoteCount);
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initial.selectedGenres);

  useEffect(() => {
    const current = {
      mediaType,
      minRating,
      maxRating,
      releaseYearFrom,
      releaseYearTo,
      minVoteCount,
      selectedGenres,
    };
    try {
      if (JSON.stringify(current) === JSON.stringify(defaults())) {
        localStorage.removeItem(FILTERS_STORAGE_KEY);
      } else {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(current));
      }
    } catch {
      // storage unavailable: filters just won't persist
    }
  }, [
    mediaType,
    minRating,
    maxRating,
    releaseYearFrom,
    releaseYearTo,
    minVoteCount,
    selectedGenres,
  ]);

  /**
   * Toggles genre selection.
   */
  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const resetFilters = () => {
    setMediaType('movie');
    setMinRating(0);
    setMaxRating(10);
    setReleaseYearFrom(MIN_RELEASE_YEAR);
    setReleaseYearTo(new Date().getFullYear());
    setMinVoteCount(0);
    setSelectedGenres([]);
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
    resetFilters,
  };
}
