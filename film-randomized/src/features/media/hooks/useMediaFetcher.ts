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
import type { MediaFilters, MediaType, TmdbMedia } from '../../../shared/types/index.js';

export interface UseMediaFetcherReturn {
  randomMedia: TmdbMedia | null;
  isLoading: boolean;
  error: string | null;
  generateRandomMedia: (filters: MediaFilters, mediaType: boolean) => Promise<void>;
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
  const { token } = useAuth();
  const loadExclusionList = useMediaExclusionList();

  const [randomMedia, setRandomMedia] = useState<TmdbMedia | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateRandomMedia = useCallback(
    async (filters: MediaFilters, mediaType: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const excludedItems = await loadExclusionList(token);
        const { discoverUrl, totalPages } = await discoverMedia(
          mediaType,
          filters,
        );

        const details = await pickRandomValidMedia({
          fetchPage: (page: number) => fetchMediaPage(discoverUrl, page),
          fetchDetails: (mt: MediaType, id: number) => fetchMediaDetails(mt === 'movie', id),
          totalPages,
          mediaType,
          excludedItems: excludedItems as unknown as Record<string, unknown>[],
          maxAttempts: MAX_GENERATION_ATTEMPTS,
        });

        if (token) {
          try {
            await recordDiscovered(details, mediaType, token);
          } catch (recordErr) {
            logger.error(
              'useMediaFetcher.recordDiscovered',
              recordErr instanceof Error ? recordErr.message : recordErr,
            );
            setError(
              (recordErr instanceof Error ? recordErr.message : null) ||
                'Could not save this title to your discovered list. Please try again.',
            );
            return;
          }
        }

        setRandomMedia(details as TmdbMedia);
      } catch (err) {
        logger.error(
          'useMediaFetcher.generate',
          err instanceof Error ? err.message : err,
        );
        setError(
          (err instanceof Error ? err.message : null) ||
            'An error occurred. Please try again later.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, loadExclusionList],
  );

  return {
    randomMedia,
    isLoading,
    error,
    generateRandomMedia,
  };
}
