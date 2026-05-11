/**
 * TMDB API client wrapper.
 * Provides a centralized client for TMDb API requests with error handling and API key management.
 */
import { API_KEY } from '../constants/api.js';
import i18n from 'i18next';
import { TmdbError } from '../types/index.js';
export { TmdbError };

const getLanguage = (): string => {
  const lang = i18n.language || 'it-IT';
  if (lang === 'it') return 'it-IT';
  if (lang === 'en') return 'en-US';
  return lang.includes('-') ? lang : `${lang}-${lang.toUpperCase()}`;
};

async function handleApiResponse<T = unknown>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'TMDB API error occurred';
    try {
      const error = (await response.json()) as { status_message?: string };
      errorMessage = error.status_message || `TMDB API error: ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new TmdbError(errorMessage, response.status);
  }
  return (await response.json()) as T;
}

export const tmdbClient = {
  async get<T = unknown>(endpoint: string): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${endpoint}${separator}api_key=${API_KEY}&language=${getLanguage()}`;
    const response = await fetch(url);
    return handleApiResponse<T>(response);
  },

  async fetchRaw<T = unknown>(url: string): Promise<T> {
    const response = await fetch(url);
    return handleApiResponse<T>(response);
  },
};
