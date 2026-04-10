import { apiClient } from './apiClient.js';

/**
 * Normalizes a discovered row from the API for UI (snake_case, media_type).
 * @param {Object} item - Raw row from API
 * @returns {Object}
 */
function normalizeDiscoveredItem(item) {
  if (!item || typeof item !== 'object') return item;
  const rawTmdb = item.tmdb_id ?? item.tmdbId;
  const tmdb_id = typeof rawTmdb === 'string' ? Number(rawTmdb) : rawTmdb;
  let media_type = item.media_type ?? item.mediaType;
  if (media_type === true) media_type = 'movie';
  if (media_type === false) media_type = 'tv';

  return {
    ...item,
    tmdb_id,
    media_type,
    poster_path: item.poster_path ?? item.posterPath,
    backdrop_path: item.backdrop_path ?? item.backdropPath,
    original_title: item.original_title ?? item.originalTitle,
    vote_average: item.vote_average ?? item.voteAverage,
    vote_count: item.vote_count ?? item.voteCount,
    release_date: item.release_date ?? item.releaseDate,
  };
}

/**
 * @param {string} token - JWT
 * @returns {Promise<Array<Object>>}
 */
export async function getDiscovered(token) {
  const list = await apiClient.get('/discovered', token);
  return Array.isArray(list) ? list.map(normalizeDiscoveredItem) : list;
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
  return normalizeDiscoveredItem(created);
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
