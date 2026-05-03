import { apiClient, ApiError } from './apiClient.js';
import { normalizeMediaItem } from '../utils/normalizeMediaItem.js';

/**
 * Watchlist API service.
 * Handles all watchlist-related API calls to the backend using the centralized client.
 */

/**
 * Adds a media item to the watchlist.
 *
 * @param {Object} media - Media object with all details from TMDb
 * @param {number} media.id - TMDB ID
 * @param {string} media.title - Title (for movies)
 * @param {string} media.name - Title (for TV shows)
 * @param {boolean|'movie'|'tv'} mediaType - true or 'movie' for film, false or 'tv' for TV
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} Promise that resolves to the created watchlist item
 * @throws {import('./apiClient').ApiError} If the request fails
 */
export async function addToWatchlist(media, mediaType, token) {
  const mediaTypeStr =
    mediaType === true || mediaType === 'movie' ? 'movie' : 'tv';

  const payload = {
    tmdb_id: media.id,
    media_type: mediaTypeStr,
    title: media.title || media.name,
    original_title: media.original_title || media.original_name,
    overview: media.overview,
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    vote_average: media.vote_average,
    vote_count: media.vote_count,
    release_date: media.release_date || media.first_air_date,
    genres: JSON.stringify(media.genres || []),
    runtime: media.runtime || null,
    number_of_seasons: media.number_of_seasons || null,
    number_of_episodes: media.number_of_episodes || null,
  };

  const created = await apiClient.post('/watchlist', payload, token);
  return normalizeMediaItem(created);
}

/**
 * Gets all items from the watchlist.
 *
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Array<Object>>} Promise that resolves to array of watchlist items
 * @throws {import('./apiClient').ApiError} If the request fails
 */
export async function getWatchlist(token) {
  const list = await apiClient.get('/watchlist', token);
  return Array.isArray(list) ? list.map(normalizeMediaItem) : list;
}

/**
 * Checks if a media item is in the watchlist.
 *
 * @param {number} tmdbId - TMDB ID of the media
 * @param {string} token - JWT token for authentication
 * @returns {Promise<boolean>} Promise that resolves to true if item is in watchlist
 */
export async function checkInWatchlist(tmdbId, token) {
  try {
    const data = await apiClient.get(`/watchlist/${tmdbId}`, token);
    const id = data.tmdb_id ?? data.tmdbId;
    return Boolean(data && id === tmdbId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Removes a media item from the watchlist.
 *
 * @param {number} tmdbId - TMDB ID of the media to remove
 * @param {string} token - JWT token for authentication
 * @returns {Promise<void>} Promise that resolves when item is removed
 * @throws {import('./apiClient').ApiError} If the request fails
 */
export async function removeFromWatchlist(tmdbId, token) {
  return apiClient.delete(`/watchlist/${tmdbId}`, token);
}
