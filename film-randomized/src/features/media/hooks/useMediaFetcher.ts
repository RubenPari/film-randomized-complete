import { useCallback, useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import { recordDiscovered } from '../../../shared/services/discoveredApi.js';
import {
  discoverMedia,
  fetchMediaPage,
  fetchMediaDetails,
} from '../../../shared/services/tmdbApi.js';
import { MAX_GENERATION_ATTEMPTS } from '../../../shared/constants/config.js';
import { pickRandomValidMedia } from '../../../shared/utils/pickRandomValidMedia.js';
import { logger } from '../../../shared/utils/logger.js';
import { useMediaExclusionList } from './useMediaExclusionList.js';
import {
  buildFeedbackRecord,
  buildRecommendationProfile,
  getMediaFeedbackValue,
  loadRecommendationFeedback,
  saveRecommendationFeedback,
} from '../../../shared/services/recommendationFeedbackStore.js';
import type {
  MediaFeedbackReason,
  MediaFeedbackValue,
  MediaFilters,
  MediaType,
  TmdbMedia,
} from '../../../shared/types/index.js';

export interface UseMediaFetcherReturn {
  randomMedia: TmdbMedia | null;
  generatedMediaType: MediaType | null;
  recommendationExplanationKeys: string[];
  currentMediaFeedbackValue: MediaFeedbackValue | null;
  isLoading: boolean;
  error: string | null;
  generateRandomMedia: (filters: MediaFilters, mediaType: MediaType) => Promise<void>;
  submitMediaFeedback: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
}

/**
 * Orchestration hook for the "generate random media" flow. The heavy lifting
 * lives in pure modules:
 *   - `useMediaExclusionList` — fetches watchlist + discovered into one list.
 *   - `pickRandomValidMedia`  — recursively picks a valid candidate.
 *
 * This hook only owns React state (`randomMedia`, `isLoading`, `error`) and
 * the "record discovered" side-effect on success.
 */
export function useMediaFetcher(): UseMediaFetcherReturn {
  const { token, user } = useAuth();
  const loadExclusionList = useMediaExclusionList();

  const [randomMedia, setRandomMedia] = useState<TmdbMedia | null>(null);
  const [generatedMediaType, setGeneratedMediaType] = useState<MediaType | null>(null);
  const [recommendationExplanationKeys, setRecommendationExplanationKeys] = useState<string[]>([]);
  const [currentMediaFeedbackValue, setCurrentMediaFeedbackValue] =
    useState<MediaFeedbackValue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const submitMediaFeedback = useCallback(
    (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => {
      if (!randomMedia || !generatedMediaType) return;
      const record = buildFeedbackRecord(randomMedia, generatedMediaType, value, reason);
      const history = saveRecommendationFeedback(user?.id, record);
      setCurrentMediaFeedbackValue(
        getMediaFeedbackValue(history, randomMedia.id, record.media_type)
      );
    },
    [generatedMediaType, randomMedia, user?.id]
  );

  const generateRandomMedia = useCallback(
    async (filters: MediaFilters, mediaType: MediaType) => {
      setIsLoading(true);
      setError(null);

      try {
        const feedbackHistory = loadRecommendationFeedback(user?.id);
        const recommendationProfile = buildRecommendationProfile(feedbackHistory);
        const excludedItems = await loadExclusionList(token, user?.id);
        const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);
        const result = await pickRandomValidMedia({
          fetchPage: (page: number) => fetchMediaPage(discoverUrl, page),
          fetchDetails: (mt: MediaType, id: number) => fetchMediaDetails(mt, id),
          totalPages,
          mediaType,
          excludedItems,
          recommendationProfile,
          maxAttempts: MAX_GENERATION_ATTEMPTS,
        });

        if (token) {
          try {
            await recordDiscovered(result.media, mediaType, token);
          } catch (recordErr) {
            logger.error(
              'useMediaFetcher.recordDiscovered',
              recordErr instanceof Error ? recordErr.message : recordErr
            );
            // Do not block the main "generate" flow if discovered persistence fails.
          }
        }

        setRandomMedia(result.media);
        setGeneratedMediaType(mediaType);
        setRecommendationExplanationKeys(result.explanationKeys);
        setCurrentMediaFeedbackValue(
          getMediaFeedbackValue(feedbackHistory, result.media.id, mediaType)
        );
      } catch (err) {
        logger.error('useMediaFetcher.generate', err instanceof Error ? err.message : err);
        setError(
          (err instanceof Error ? err.message : null) ||
            'An error occurred. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, loadExclusionList, user?.id]
  );

  return {
    randomMedia,
    generatedMediaType,
    recommendationExplanationKeys,
    currentMediaFeedbackValue,
    isLoading,
    error,
    generateRandomMedia,
    submitMediaFeedback,
  };
}
