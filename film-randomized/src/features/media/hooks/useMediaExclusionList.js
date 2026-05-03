import { useCallback } from 'react';
import { getWatchlist } from '../../../shared/services/watchlistApi.js';
import { getDiscovered } from '../../../shared/services/discoveredApi.js';
import { logger } from '../../../shared/utils/logger.js';

/**
 * Returns a stable `loadExclusionList(token)` that fetches the user's
 * watchlist + discovered lists and concatenates them into a single
 * exclusion set. Failures on either side degrade silently to an empty
 * list — the generator must still work for a user who has only one of
 * the two populated, or whose list endpoint happens to be down.
 */
export function useMediaExclusionList() {
  return useCallback(async function loadExclusionList(token) {
    if (!token) return [];

    const [watchlist, discovered] = await Promise.all([
      getWatchlist(token).catch((err) => {
        logger.warn('useMediaExclusionList.watchlist', err);
        return [];
      }),
      getDiscovered(token).catch((err) => {
        logger.warn('useMediaExclusionList.discovered', err);
        return [];
      }),
    ]);

    return [...watchlist, ...discovered];
  }, []);
}
