import { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import { getWatchlist } from '../../../shared/services/watchlistApi.js';
import { getDiscovered, recordDiscovered } from '../../../shared/services/discoveredApi.js';
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
  isExcludedForCurrentType,
  resolveMediaTypeString,
} from '../../../shared/utils/mediaUtils.js';

export function useMediaFetcher() {
  const { token } = useAuth();
  const [randomMedia, setRandomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRandomMedia = async (filters, mediaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const excludedItems = await fetchExcludedItems(token);
      const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);

      const details = await findValidRandomMedia(
        discoverUrl,
        totalPages,
        mediaType,
        excludedItems,
        0,
      );

      if (token) {
        try {
          await recordDiscovered(details, mediaType, token);
        } catch (recordErr) {
          console.error('Failed to record discovered title:', recordErr);
          setError(
            recordErr.message ||
              'Could not save this title to your discovered list. Please try again.',
          );
          return;
        }
      }

      setRandomMedia(details);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExcludedItems = async (authToken) => {
    if (!authToken) return [];
    let watchlist = [];
    let discovered = [];
    try {
      watchlist = await getWatchlist(authToken);
    } catch {
      watchlist = [];
    }
    try {
      discovered = await getDiscovered(authToken);
    } catch {
      discovered = [];
    }
    return [...watchlist, ...discovered];
  };

  const findValidRandomMedia = async (
    discoverUrl,
    totalPages,
    mediaType,
    excludedItems,
    attempt,
  ) => {
    if (attempt >= MAX_GENERATION_ATTEMPTS) {
      throw new Error('No content found. Try modifying the filters.');
    }

    const randomPage = getRandomPage(totalPages);
    const pageData = await fetchMediaPage(discoverUrl, randomPage);

    const filteredResults = filterValidMedia(pageData.results, excludedItems, mediaType);

    if (filteredResults.length === 0) {
      return findValidRandomMedia(
        discoverUrl,
        totalPages,
        mediaType,
        excludedItems,
        attempt + 1,
      );
    }

    const selectedMedia = getRandomMedia(filteredResults);
    const details = await fetchMediaDetails(mediaType, selectedMedia.id);

    if (!isValidMedia(details, excludedItems, mediaType)) {
      return findValidRandomMedia(
        discoverUrl,
        totalPages,
        mediaType,
        excludedItems,
        attempt + 1,
      );
    }

    return details;
  };

  const isValidMedia = (details, excludedItems, mediaType) => {
    const mt = resolveMediaTypeString(mediaType);
    const excluded = isExcludedForCurrentType(details.id, mt, excludedItems);
    return hasValidDescription(details) && !excluded;
  };

  return {
    randomMedia,
    isLoading,
    error,
    generateRandomMedia,
  };
}
