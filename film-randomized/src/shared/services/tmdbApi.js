/**
 * TMDB API Service
 * Handles all interactions with The Movie Database API
 */
import { API_ENDPOINTS } from '../constants/api.js';
import { TMDB_MAX_PAGE } from '../constants/config.js';
import { tmdbClient, TmdbError } from './tmdbClient.js';

/**
 * Discovers media based on provided filters.
 *
 * @param {boolean} mediaType - True for movies, false for TV shows
 * @param {Object} filters - Filter options
 * @param {number} filters.minRating - Minimum rating
 * @param {number} filters.maxRating - Maximum rating
 * @param {number[]} filters.selectedGenres - Selected genre IDs
 * @param {number} filters.releaseYearFrom - Release year from
 * @param {number} filters.releaseYearTo - Release year to
 * @param {number} filters.minVoteCount - Minimum vote count
 * @returns {Promise<{discoverUrl: string, totalPages: number}>} Discovery URL and total pages
 * @throws {TmdbError} If request fails or no results found
 */
export const discoverMedia = async (mediaType, filters) => {
  const mediaTypeParam = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.discover(mediaTypeParam);
  const urlParams = new URLSearchParams();

  urlParams.append('vote_average.gte', filters.minRating);
  urlParams.append('vote_average.lte', filters.maxRating);

  if (filters.selectedGenres && filters.selectedGenres.length > 0) {
    urlParams.append('with_genres', filters.selectedGenres.join(','));
  }

  if (filters.releaseYearFrom) {
    urlParams.append(
      mediaType ? 'primary_release_date.gte' : 'first_air_date.gte',
      `${filters.releaseYearFrom}-01-01`
    );
  }

  if (filters.releaseYearTo) {
    urlParams.append(
      mediaType ? 'primary_release_date.lte' : 'first_air_date.lte',
      `${filters.releaseYearTo}-12-31`
    );
  }

  if (filters.minVoteCount > 0) {
    urlParams.append('vote_count.gte', filters.minVoteCount);
  }

  const data = await tmdbClient.get(`${endpoint}?${urlParams.toString()}`);

  if (data.results.length === 0) {
    throw new TmdbError('No results found with these filters', 404);
  }

  return {
    discoverUrl: `${endpoint}?${urlParams.toString()}`,
    totalPages: Math.min(data.total_pages, TMDB_MAX_PAGE),
  };
};

/**
 * Fetches a specific page of media results.
 *
 * @param {string} discoverUrl - Discovery URL from discoverMedia
 * @param {number} pageNumber - Page number to fetch
 * @returns {Promise<Object>} TMDB API response with results array
 * @throws {TmdbError} If request fails
 */
export const fetchMediaPage = async (discoverUrl, pageNumber) => {
  return tmdbClient.get(`${discoverUrl}&page=${pageNumber}`);
};

/**
 * Fetches detailed information for a specific media item.
 *
 * @param {boolean} mediaType - True for movies, false for TV shows
 * @param {number} mediaId - TMDB ID
 * @returns {Promise<Object>} Media details
 * @throws {TmdbError} If request fails
 */
export const fetchMediaDetails = async (mediaType, mediaId) => {
  const mediaTypeParam = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.details(mediaTypeParam, mediaId);
  return tmdbClient.get(endpoint);
};

/**
 * Fetches videos (trailers, teasers) for a specific media item.
 * Falls back to English if no videos found in current language.
 *
 * @param {boolean} mediaType - True for movies, false for TV shows
 * @param {number} mediaId - TMDB ID
 * @returns {Promise<Object>} Videos data with results array
 * @throws {TmdbError} If request fails
 */
export const fetchMediaVideos = async (mediaType, mediaId) => {
  const mediaTypeParam = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.videos(mediaTypeParam, mediaId);
  const data = await tmdbClient.get(endpoint);

  if (!data.results || data.results.length === 0) {
    // Fallback to English if no videos found in current language
    const responseEn = await tmdbClient.fetchRaw(
      `${endpoint}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
    );
    return responseEn;
  }

  return data;
};

/**
 * Single source of truth for genre list: one in-memory cache + one in-flight promise.
 * Hooks (e.g. useGenres) must call fetchGenres only — do not duplicate caching there.
 */
let cachedGenres = null;
let cachedGenresPromise = null;

/**
 * Fetches the list of all available genres.
 * Implements an aggressive in-memory caching mechanism to optimize repeated loads
 * (e.g., when toggling between movies and TV).
 *
 * @returns {Promise<Array<{id: number, name: string}>>} Array of genre objects
 * @throws {TmdbError} If request fails
 */
export const fetchGenres = async () => {
  if (cachedGenres) return cachedGenres;

  if (!cachedGenresPromise) {
    cachedGenresPromise = (async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          tmdbClient.get(API_ENDPOINTS.movieGenres),
          tmdbClient.get(API_ENDPOINTS.tvGenres),
        ]);

        const uniqueGenresMap = new Map();

        movieData.genres.forEach((genre) => {
          uniqueGenresMap.set(genre.id, genre);
        });

        tvData.genres.forEach((genre) => {
          if (!uniqueGenresMap.has(genre.id)) {
            uniqueGenresMap.set(genre.id, genre);
          }
        });

        cachedGenres = Array.from(uniqueGenresMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        return cachedGenres;
      } catch (error) {
        cachedGenresPromise = null; // Reset promise on error so it can be retried
        throw error;
      }
    })();
  }

  return cachedGenresPromise;
};
