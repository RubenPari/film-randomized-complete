import type { MediaType, TmdbMedia } from '../types/index.js';

/**
 * Payload per il backend
 */
export interface BackendMediaPayload {
  /**
   * ID del media
   */
  tmdb_id: number;
  /**
   * Tipo di media
   */
  media_type: MediaType;
  /**
   * Titolo del media
   */
  title: string;
  /**
   * Titolo originale del media
   */
  original_title: string | undefined;
  /**
   * Descrizione del media
   */
  overview: string | undefined;
  /**
   * Path del poster
   */
  poster_path: string | null | undefined;
  /**
   * Path del backdrop
   */
  backdrop_path: string | null | undefined;
  /**
   * Voto medio
   */
  vote_average: number | undefined;
  /**
   * Numero di voti
   */
  vote_count: number | undefined;
  /**
   * Data di rilascio
   */
  release_date: string | undefined;
  /**
   * Generi
   */
  genres: string;
  /**
   * Durata del media
   */
  runtime: number | null;
  /**
   * Numero di stagioni
   */
  number_of_seasons: number | null;
  /**
   * Numero di episodi
   */
  number_of_episodes: number | null;
}

/**
 * Costruisce il payload per il backend
 * @param media Media da cui costruire il payload
 * @param mediaType Tipo di media
 * @returns Payload per il backend
 */
export function buildBackendMediaPayload(
  media: TmdbMedia,
  mediaType: MediaType
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
