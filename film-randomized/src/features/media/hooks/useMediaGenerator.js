import { useTransition } from 'react';
import { useMediaFilters } from './useMediaFilters.js';
import { useGenres } from './useGenres.js';
import { useMediaFetcher } from './useMediaFetcher.js';
import { useMediaHistory } from './useMediaHistory.js';

/**
 * Custom hook for managing media generation state and logic.
 * Aggregates smaller hooks to provide a unified interface, utilizing React 19's useTransition
 * to keep the UI responsive while filtering.
 */
export function useMediaGenerator() {
  const {
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
  } = useMediaFilters();

  const { genres, error: genresError } = useGenres();

  const historyManager = useMediaHistory();

  const {
    randomMedia,
    isLoading: isFetching,
    error: fetchError,
    generateRandomMedia,
  } = useMediaFetcher(historyManager);

  // useTransition for fluid UI updates when modifying non-critical states (like filters)
  const [isPendingFilter, startTransition] = useTransition();

  // Wrappers to apply filters inside a transition, avoiding blocking the main thread
  const handleMediaTypeChange = (val) => startTransition(() => setMediaType(val));
  const handleMinRatingChange = (val) => startTransition(() => setMinRating(val));
  const handleMaxRatingChange = (val) => startTransition(() => setMaxRating(val));
  const handleReleaseYearFromChange = (val) => startTransition(() => setReleaseYearFrom(val));
  const handleReleaseYearToChange = (val) => startTransition(() => setReleaseYearTo(val));
  const handleMinVoteCountChange = (val) => startTransition(() => setMinVoteCount(val));
  const handleGenreToggleTransition = (val) => startTransition(() => handleGenreToggle(val));

  const handleGenerateRandomMedia = () => {
    const filters = {
      minRating,
      maxRating,
      selectedGenres,
      releaseYearFrom,
      releaseYearTo,
      minVoteCount,
    };
    generateRandomMedia(filters, mediaType);
  };

  return {
    mediaType,
    setMediaType: handleMediaTypeChange,
    minRating,
    setMinRating: handleMinRatingChange,
    maxRating,
    setMaxRating: handleMaxRatingChange,
    releaseYearFrom,
    setReleaseYearFrom: handleReleaseYearFromChange,
    releaseYearTo,
    setReleaseYearTo: handleReleaseYearToChange,
    minVoteCount,
    setMinVoteCount: handleMinVoteCountChange,
    selectedGenres,
    handleGenreToggle: handleGenreToggleTransition,
    genres,
    randomMedia,
    isLoading: isFetching || isPendingFilter,
    error: fetchError || genresError,
    viewedMedia: historyManager.viewedMedia,
    generateRandomMedia: handleGenerateRandomMedia,
    exportViewedMedia: historyManager.exportViewedMedia,
    importViewedMedia: historyManager.importViewedMedia,
  };
}
