import { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import { getWatchlist } from '../../../shared/services/watchlistApi.js';
import {
  discoverMedia,
  fetchMediaPage,
  fetchMediaDetails,
} from '../../../shared/services/tmdbApi.js';
import { MAX_GENERATION_ATTEMPTS } from '../../../shared/constants/config.js';
import {
  filterValidMedia,
  hasValidDescription,
  getRandomPage,
  getRandomMedia,
} from '../../../shared/utils/mediaUtils.js';

export function useMediaFetcher(viewedMediaManager) {
  const { token } = useAuth();
  const [randomMedia, setRandomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRandomMedia = async (filters, mediaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const watchlist = await fetchUserWatchlist(token);
      const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);

      const details = await findValidRandomMedia(discoverUrl, totalPages, mediaType, watchlist, 0);

      setRandomMedia(details);
      viewedMediaManager.addViewedMedia(details);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserWatchlist = async (token) => {
    if (!token) return [];
    try {
      return await getWatchlist(token);
    } catch {
      return [];
    }
  };

  const findValidRandomMedia = async (discoverUrl, totalPages, mediaType, watchlist, attempt) => {
    if (attempt >= MAX_GENERATION_ATTEMPTS) {
      throw new Error('No content found. Try modifying the filters.');
    }

    const randomPage = getRandomPage(totalPages);
    const pageData = await fetchMediaPage(discoverUrl, randomPage);

    const activeViewedMedia = viewedMediaManager.clearViewedMediaCacheIfTooLarge();
    const filteredResults = filterValidMedia(pageData.results, activeViewedMedia, watchlist);

    if (filteredResults.length === 0) {
      return findValidRandomMedia(discoverUrl, totalPages, mediaType, watchlist, attempt + 1);
    }

    const selectedMedia = getRandomMedia(filteredResults);
    const details = await fetchMediaDetails(mediaType, selectedMedia.id);

    if (!isValidMedia(details, watchlist)) {
      return findValidRandomMedia(discoverUrl, totalPages, mediaType, watchlist, attempt + 1);
    }

    return details;
  };

  const isValidMedia = (details, watchlist) => {
    const isInWatchlist = watchlist.some((item) => item.tmdb_id === details.id);
    return hasValidDescription(details) && !isInWatchlist;
  };

  return {
    randomMedia,
    isLoading,
    error,
    generateRandomMedia,
  };
}
