/**
 * TMDB API client wrapper.
 * Provides a centralized client for TMDb API requests with error handling and API key management.
 */
import { API_KEY, BASE_URL } from '../constants/api.js';
import i18n from 'i18next';

/**
 * Custom error class for TMDB API errors.
 */
export class TmdbError extends Error {
  /**
   * Creates an instance of TmdbError.
   *
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   */
  constructor(message, status) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

/**
 * Gets the current language for TMDB API requests.
 * Falls back to 'it-IT' if i18n is not initialized.
 *
 * @returns {string} Language code for TMDB API
 */
const getLanguage = () => {
  const lang = i18n.language || 'it-IT';
  if (lang === 'it') return 'it-IT';
  if (lang === 'en') return 'en-US';
  return lang.includes('-') ? lang : `${lang}-${lang.toUpperCase()}`;
};

/**
 * Handles TMDB API response and throws appropriate errors.
 *
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {TmdbError} If response is not ok
 */
async function handleApiResponse(response) {
  if (!response.ok) {
    let errorMessage = 'TMDB API error occurred';
    try {
      const error = await response.json();
      errorMessage = error.status_message || `TMDB API error: ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new TmdbError(errorMessage, response.status);
  }
  return response.json();
}

/**
 * TMDB API client.
 * Provides methods for making HTTP requests to The Movie Database API.
 */
export const tmdbClient = {
  /**
   * Makes a GET request to TMDB API.
   * Automatically adds API key and language parameters.
   *
   * @param {string} endpoint - Full TMDB API endpoint URL (with query params if needed)
   * @returns {Promise<Object>} Promise that resolves to response data
   * @throws {TmdbError} If request fails
   */
  async get(endpoint) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${endpoint}${separator}api_key=${API_KEY}&language=${getLanguage()}`;
    const response = await fetch(url);
    return handleApiResponse(response);
  },

  /**
   * Makes a GET request to TMDB API without automatic language parameter.
   * Useful for endpoints that need custom language handling.
   *
   * @param {string} url - Full URL to fetch
   * @returns {Promise<Object>} Promise that resolves to response data
   * @throws {TmdbError} If request fails
   */
  async fetchRaw(url) {
    const response = await fetch(url);
    return handleApiResponse(response);
  },
};
