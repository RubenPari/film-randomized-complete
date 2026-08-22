import { MediaType } from '../types/index.js';

/**
 * Estende Record<string, unknown> con i campi comuni dei media, fornendo tipi più specifici per agevolare l'autocompletamento.
 */
export interface NormalizableItem extends Record<string, unknown> {
  /**
   * ID univoco del media
   */
  id?: number;
  /**
   * ID univoco del media
   */
  tmdb_id?: number;
  /**
   * ID univoco del media
   */
  tmdbId?: number | string;
  /**
   * Tipo di media
   */
  media_type?: MediaType | string | boolean;
  /**
   * Tipo di media
   */
  mediaType?: boolean | MediaType | string;
  /**
   * Titolo del media
   */
  title?: string;
  /**
   * Nome del media
   */
  name?: string;
  /**
   * Titolo originale del media
   */
  original_title?: string;
  /**
   * Nome originale del media
   */
  original_name?: string;
  /**
   * Titolo originale del media
   */
  originalTitle?: string;
  /**
   * Descrizione del media
   */
  overview?: string;
  /**
   * Poster del media
   */
  poster_path?: string | null;
  /**
   * Poster del media
   */
  posterPath?: string | null;
  /**
   * Backdrop del media
   */
  backdrop_path?: string | null;
  /**
   * Backdrop del media
   */
  backdropPath?: string | null;
  /**
   * Voto medio del media
   */
  vote_average?: number;
  /**
   * Voto medio del media
   */
  voteAverage?: number;
  /**
   * Numero di voti del media
   */
  vote_count?: number;
  /**
   * Numero di voti del media
   */
  voteCount?: number;
  /**
   * Data di rilascio del media
   */
  release_date?: string;
  /**
   * Data di rilascio del media
   */
  releaseDate?: string;
  /**
   * Data di messa in onda del media
   */
  first_air_date?: string;
  /**
   * Generi del media
   */
  genres?: unknown;
  /**
   * Durata del media
   */
  runtime?: number | null;
  /**
   * Numero di stagioni del media
   */
  number_of_seasons?: number | null;
  /**
   * Numero di episodi del media
   */
  number_of_episodes?: number | null;
}

/**
 * Normalizza un item del media
 * @param item Item del media da normalizzare
 * @returns Item del media normalizzato
 */
export function normalizeMediaItem(
  item: NormalizableItem | null | undefined
): NormalizableItem | null | undefined {
  if (!item || typeof item !== 'object') return item;

  // Estrae l'ID di tmdb normalizzandolo
  const rawTmdb = item.tmdb_id ?? item.tmdbId;
  const tmdb_id = typeof rawTmdb === 'string' ? Number(rawTmdb) : rawTmdb;

  // Estrae il tipo di media normalizzandolo
  let media_type: MediaType | string | boolean | undefined = item.media_type ?? item.mediaType;
  if (media_type === true) media_type = 'movie';
  if (media_type === false) media_type = 'tv';

  // Estrae i campi comuni del media normalizzandoli
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
 * Ottiene la chiave univoca di un item del media
 * @param item Item del media da cui estrarre la chiave
 * @returns Chiave univoca dell'item del media
 */
export function getMediaItemKey(item: NormalizableItem): string {
  const id = item.tmdb_id ?? item.tmdbId;
  const mt = item.media_type ?? item.mediaType ?? 'movie';
  return `${mt}-${id}`;
}
