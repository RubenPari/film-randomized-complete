import { apiClient } from './apiClient.js';
import { normalizeMediaItem } from '../utils/normalizeMediaItem.js';

/**
 * @param {string} token - JWT
 * @returns {Promise<Array<Object>>}
 */
export async function getDiscovered(token) {
  const list = await apiClient.get('/discovered', token);
  return Array.isArray(list) ? list.map(normalizeMediaItem) : list;
}

/**
 * @param {Object} media - TMDb details object
 * @param {boolean|'movie'|'tv'} mediaType - movie or tv
 * @param {string} token - JWT
 * @returns {Promise<Object>}
 */
export async function recordDiscovered(media, mediaType, token) {
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

  const created = await apiClient.post('/discovered', payload, token);
  return normalizeMediaItem(created);
}

/**
 * @param {'movie'|'tv'} mediaType
 * @param {number} tmdbId
 * @param {string} token - JWT
 * @returns {Promise<void>}
 */
export async function removeDiscovered(mediaType, tmdbId, token) {
  return apiClient.delete(`/discovered/${mediaType}/${tmdbId}`, token);
}
