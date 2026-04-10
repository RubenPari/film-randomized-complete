/**
 * API configuration constants for The Movie Database (TMDb).
 * Contains API key, base URLs, and endpoint builders.
 */

/**
 * API key for accessing TMDb API.
 * Retrieved from environment variable VITE_TMDB_API_KEY.
 * @type {string}
 */
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (import.meta.env.DEV && !import.meta.env.VITE_TMDB_API_KEY) {
  console.warn(
    '[Film Randomized] VITE_TMDB_API_KEY is missing. TMDb API calls will fail until it is set in .env'
  );
}

/**
 * Base URL for all TMDb API requests.
 * @type {string}
 */
export const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Base URL for TMDb image assets.
 * @type {string}
 */
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * API endpoint URLs and builders for TMDb API.
 * @type {Object}
 */
export const API_ENDPOINTS = {
  /**
   * Endpoint for retrieving movie genres.
   * @type {string}
   */
  movieGenres: `${BASE_URL}/genre/movie/list`,

  /**
   * Endpoint for retrieving TV show genres.
   * @type {string}
   */
  tvGenres: `${BASE_URL}/genre/tv/list`,

  /**
   * Builds the discovery endpoint URL for movies or TV shows.
   * @param {string} mediaTypes - 'movie' or 'tv'
   * @returns {string} The discovery endpoint URL
   */
  discover: function (mediaTypes) {
    return `${BASE_URL}/discover/${mediaTypes}`;
  },

  /**
   * Builds the details endpoint URL for a specific media item.
   * @param {string} mediaType - 'movie' or 'tv'
   * @param {number} id - The media item ID
   * @returns {string} The details endpoint URL
   */
  details: function (mediaType, id) {
    return `${BASE_URL}/${mediaType}/${id}`;
  },

  /**
   * Builds the videos endpoint URL for a specific media item.
   * @param {string} mediaType - 'movie' or 'tv'
   * @param {number} id - The media item ID
   * @returns {string} The videos endpoint URL
   */
  videos: function (mediaType, id) {
    return `${BASE_URL}/${mediaType}/${id}/videos`;
  },
};
