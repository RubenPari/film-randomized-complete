import { useTransition } from 'react';
import { useMediaFilters } from './useMediaFilters.js';
import { useGenres } from './useGenres.js';
import { useMediaFetcher } from './useMediaFetcher.js';
import type {
  Genre,
  MediaFeedbackReason,
  MediaFeedbackValue,
  TmdbMedia,
  MediaFilters,
  MediaType,
  MediaCredit,
} from '../../../shared/types/index.js';

export interface UseMediaGeneratorReturn {
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
  genres: Genre[];
  isGenresLoading: boolean;
  genresError: string | null;
  randomMedia: TmdbMedia | null;
  generatedMediaType: MediaType | null;
  recommendationExplanationKeys: string[];
  aiExplanation: string | null;
  cast: MediaCredit[];
  currentMediaFeedbackValue: MediaFeedbackValue | null;
  isLoading: boolean;
  isGenerating: boolean;
  isFilterPending: boolean;
  error: string | null;
  generateRandomMedia: () => void;
  submitMediaFeedback: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
}

/**
 * Custom hook for managing media generation state and logic.
 * Aggregates smaller hooks to provide a unified interface, utilizing React 19's useTransition
 * to keep the UI responsive while filtering.
 */
export function useMediaGenerator(): UseMediaGeneratorReturn {
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
    resetFilters,
  } = useMediaFilters();

  const { genres, error: genresError, isLoading: isGenresLoading } = useGenres();

  const {
    randomMedia,
    generatedMediaType,
    recommendationExplanationKeys,
    aiExplanation,
    cast,
    currentMediaFeedbackValue,
    isLoading: isFetching,
    error: fetchError,
    generateRandomMedia,
    submitMediaFeedback,
  } = useMediaFetcher();

  // useTransition for fluid UI updates when modifying non-critical states (like filters)
  const [isPendingFilter, startTransition] = useTransition();

  // Wrappers to apply filters inside a transition, avoiding blocking the main thread
  const handleMediaTypeChange = (val: MediaType) => startTransition(() => setMediaType(val));
  const handleMinRatingChange = (val: number) => startTransition(() => setMinRating(val));
  const handleMaxRatingChange = (val: number) => startTransition(() => setMaxRating(val));
  const handleReleaseYearFromChange = (val: number) =>
    startTransition(() => setReleaseYearFrom(val));
  const handleReleaseYearToChange = (val: number) => startTransition(() => setReleaseYearTo(val));
  const handleMinVoteCountChange = (val: number) => startTransition(() => setMinVoteCount(val));
  const handleGenreToggleTransition = (val: number) =>
    startTransition(() => handleGenreToggle(val));
  const handleResetFilters = () => startTransition(resetFilters);

  const handleGenerateRandomMedia = () => {
    const filters: MediaFilters = {
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
    resetFilters: handleResetFilters,
    genres,
    isGenresLoading,
    genresError,
    randomMedia,
    generatedMediaType,
    recommendationExplanationKeys,
    aiExplanation,
    cast,
    currentMediaFeedbackValue,
    isLoading: isFetching || isPendingFilter,
    isGenerating: isFetching,
    isFilterPending: isPendingFilter,
    error: fetchError,
    generateRandomMedia: handleGenerateRandomMedia,
    submitMediaFeedback,
  };
}
