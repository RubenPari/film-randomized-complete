/**
 * API configuration constants for The Movie Database (TMDb).
 * Contains API key, base URLs, and endpoint builders.
 */

/**
 * API key for accessing TMDb API.
 * Retrieved from environment variable VITE_TMDB_API_KEY.
 * @type {string}
 */
export const API_KEY: string = import.meta.env.VITE_TMDB_API_KEY as string;

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
  movieGenres: `${BASE_URL}/genre/movie/list`,
  tvGenres: `${BASE_URL}/genre/tv/list`,
  discover: (mediaTypes: 'movie' | 'tv'): string => `${BASE_URL}/discover/${mediaTypes}`,
  details: (mediaType: 'movie' | 'tv', id: number): string => `${BASE_URL}/${mediaType}/${id}`,
  videos: (mediaType: 'movie' | 'tv', id: number): string => `${BASE_URL}/${mediaType}/${id}/videos`,
} as const;
