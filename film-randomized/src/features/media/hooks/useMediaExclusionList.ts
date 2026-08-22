import { useCallback } from 'react';
import { getWatchlist } from '../../../shared/services/watchlistApi.js';
import { getDiscovered } from '../../../shared/services/discoveredApi.js';
import {
  buildSmartExclusionRows,
  loadRecommendationFeedback,
} from '../../../shared/services/recommendationFeedbackStore.js';
import { logger } from '../../../shared/utils/logger.js';
import type { MediaItem } from '../../../shared/types/index.js';

/**
 * Returns a stable `loadExclusionList(token)` that fetches the user's
 * watchlist + discovered lists and concatenates them into a single
 * exclusion set. Failures on either side degrade silently to an empty
 * list — the generator must still work for a user who has only one of
 * the two populated, or whose list endpoint happens to be down.
 */
export function useMediaExclusionList() {
  return useCallback(async function loadExclusionList(
    token: string | null,
    userId: string | number | null | undefined
  ): Promise<MediaItem[]> {
    if (!token) {
      const feedbackHistory = loadRecommendationFeedback(userId);
      return buildSmartExclusionRows(feedbackHistory) as MediaItem[];
    }

    const [watchlist, discovered] = await Promise.all([
      getWatchlist(token).catch((err: unknown) => {
        logger.warn('useMediaExclusionList.watchlist', err instanceof Error ? err.message : err);
        return [];
      }),
      getDiscovered(token).catch((err: unknown) => {
        logger.warn('useMediaExclusionList.discovered', err instanceof Error ? err.message : err);
        return [];
      }),
    ]);
    const feedbackHistory = loadRecommendationFeedback(userId);
    const smartExclusionRows = buildSmartExclusionRows(feedbackHistory) as MediaItem[];
    return [...watchlist, ...discovered, ...smartExclusionRows];
  }, []);
}
