/**
 * Shared domain types used across the frontend.
 *
 * This file is the single source of truth for data shapes that cross
 * module boundaries (API responses, component props, hook contracts).
 */

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export type MediaType = 'movie' | 'tv';

/**
 * Raw TMDb media item (camelCase, as returned by the TMDb API).
 */
export interface TmdbMedia {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genres?: { id: number; name: string }[];
  runtime?: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
}

/**
 * Normalised media item (snake_case, used by the UI after passing through
 * {@link normalizeMediaItem}).
 */
export interface MediaItem {
  id?: number;
  tmdb_id: number;
  media_type: MediaType;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  genres?: string;
  runtime?: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
}

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------

export interface Genre {
  id: number;
  name: string;
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface MediaFilters {
  minRating: number;
  maxRating: number;
  selectedGenres: number[];
  releaseYearFrom: number;
  releaseYearTo: number;
  minVoteCount: number;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class TmdbError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// API Responses
// ---------------------------------------------------------------------------

export interface TmdbDiscoverResult {
  discoverUrl: string;
  totalPages: number;
}

export interface TmdbPageResponse {
  page: number;
  results: TmdbMedia[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenreListResponse {
  genres: Genre[];
}

export interface TmdbVideosResponse {
  id: number;
  results: {
    key: string;
    name: string;
    site: string;
    type: string;
  }[];
}
