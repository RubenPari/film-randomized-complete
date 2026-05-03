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

/**
 * Orchestration hook for the "generate random media" flow. The heavy lifting
 * lives in pure modules:
 *   - `useMediaExclusionList` — fetches watchlist + discovered into one list.
 *   - `pickRandomValidMedia`  — recursively picks a valid candidate.
 *
 * This hook only owns React state (`randomMedia`, `isLoading`, `error`) and
 * the "record discovered" side-effect on success.
 */
export function useMediaFetcher() {
  const { token } = useAuth();
  const loadExclusionList = useMediaExclusionList();

  const [randomMedia, setRandomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRandomMedia = useCallback(
    async (filters, mediaType) => {
      setIsLoading(true);
      setError(null);

      try {
        const excludedItems = await loadExclusionList(token);
        const { discoverUrl, totalPages } = await discoverMedia(
          mediaType,
          filters,
        );

        const details = await pickRandomValidMedia({
          fetchPage: (page) => fetchMediaPage(discoverUrl, page),
          fetchDetails: fetchMediaDetails,
          totalPages,
          mediaType,
          excludedItems,
          maxAttempts: MAX_GENERATION_ATTEMPTS,
        });

        if (token) {
          try {
            await recordDiscovered(details, mediaType, token);
          } catch (recordErr) {
            logger.error('useMediaFetcher.recordDiscovered', recordErr);
            setError(
              recordErr.message ||
                'Could not save this title to your discovered list. Please try again.',
            );
            return;
          }
        }

        setRandomMedia(details);
      } catch (err) {
        logger.error('useMediaFetcher.generate', err);
        setError(err.message || 'An error occurred. Please try again later.');
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
