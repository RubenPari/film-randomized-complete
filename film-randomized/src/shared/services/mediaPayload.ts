import type { MediaType, TmdbMedia } from '../types/index.js';

export interface BackendMediaPayload {
  tmdb_id: number;
  media_type: MediaType;
  title: string;
  original_title: string | undefined;
  overview: string | undefined;
  poster_path: string | null | undefined;
  backdrop_path: string | null | undefined;
  vote_average: number | undefined;
  vote_count: number | undefined;
  release_date: string | undefined;
  genres: string;
  runtime: number | null;
  number_of_seasons: number | null;
  number_of_episodes: number | null;
}

/**
 * Shared mapper used by watchlist/discovered POST calls.
 */
export function buildBackendMediaPayload(
  media: TmdbMedia,
  mediaType: MediaType,
): BackendMediaPayload {
  return {
    tmdb_id: media.id,
    media_type: mediaType,
    title: media.title || media.name || '',
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
}
