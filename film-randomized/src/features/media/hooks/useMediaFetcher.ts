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
import { getAiExplanation } from '../../../shared/services/recommendationApi.js';
import { fetchGenres } from '../../../shared/services/tmdbApi.js';
import type {
  MediaFeedbackReason,
  MediaFeedbackValue,
  MediaFilters,
  MediaType,
  TmdbMedia,
  RecommendationFeedback,
  Genre,
} from '../../../shared/types/index.js';

export interface UseMediaFetcherReturn {
  randomMedia: TmdbMedia | null;
  generatedMediaType: MediaType | null;
  recommendationExplanationKeys: string[];
  aiExplanation: string | null;
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
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
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

        let aiExplanationText: string | null = null;
        if (token && user?.id) {
          try {
            const genres = await fetchGenres();
            const profile = buildAiRequestProfile(feedbackHistory, genres);
            const candidateTitle = result.media.title || result.media.name || '';
            const candidateGenres = (result.media.genres || []).map((g) => g.name);
            const releaseDate =
              result.media.release_date || result.media.first_air_date;
            const releaseYear = releaseDate
              ? new Date(releaseDate).getFullYear()
              : undefined;

            const aiResult = await getAiExplanation(
              {
                userProfile: profile,
                candidate: {
                  title: candidateTitle,
                  overview: result.media.overview || '',
                  genres: candidateGenres,
                  voteAverage: result.media.vote_average ?? 0,
                  voteCount: result.media.vote_count ?? 0,
                  releaseYear,
                  runtime: result.media.runtime,
                },
              },
              token,
            );

            if (aiResult.explanation) {
              aiExplanationText = aiResult.explanation;
            }
          } catch (aiErr) {
            logger.error(
              'useMediaFetcher.aiExplain',
              aiErr instanceof Error ? aiErr.message : aiErr,
            );
          }
        }

        setRandomMedia(result.media);
        setGeneratedMediaType(mediaType);
        setRecommendationExplanationKeys(result.explanationKeys);
        setAiExplanation(aiExplanationText);
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
    aiExplanation,
    currentMediaFeedbackValue,
    isLoading,
    error,
    generateRandomMedia,
    submitMediaFeedback,
  };
}

function buildAiRequestProfile(
  feedbackHistory: RecommendationFeedback[],
  genres: Genre[],
) {
  const genreMap = new Map(genres.map((g) => [g.id, g.name]));

  const likedItems = feedbackHistory.filter((f) => f.value === 'like');
  const dislikedItems = feedbackHistory.filter((f) => f.value === 'dislike');

  const likedGenreCounts = new Map<number, number>();
  const dislikedGenreCounts = new Map<number, number>();

  for (const item of likedItems) {
    for (const gid of item.genre_ids) {
      likedGenreCounts.set(gid, (likedGenreCounts.get(gid) || 0) + 1);
    }
  }

  for (const item of dislikedItems) {
    for (const gid of item.genre_ids) {
      dislikedGenreCounts.set(gid, (dislikedGenreCounts.get(gid) || 0) + 1);
    }
  }

  const topLikedGenres = [...likedGenreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => ({ id, name: genreMap.get(id) || 'Unknown' }));

  const topDislikedGenres = [...dislikedGenreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => ({ id, name: genreMap.get(id) || 'Unknown' }));

  const likedMedia = likedItems.slice(0, 5).map((f) => ({
    title: String(f.tmdb_id),
    overview: '',
    genres: f.genre_ids.map((id) => genreMap.get(id) || 'Unknown'),
  }));

  const dislikedMedia = dislikedItems.slice(0, 5).map((f) => ({
    title: String(f.tmdb_id),
    overview: '',
    genres: f.genre_ids.map((id) => genreMap.get(id) || 'Unknown'),
    reason: f.reason,
  }));

  return {
    likedGenres: topLikedGenres,
    dislikedGenres: topDislikedGenres,
    likedMedia,
    dislikedMedia,
    likedCount: likedItems.length,
  };
}
