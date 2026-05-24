// Shared domain types used across the frontend.

// Media types
export type MediaType = 'movie' | 'tv';

/**
 * Raw TMDb media item (camelCase, as returned by the TMDb API).
 */
export interface TmdbMedia {
  /**
   * ID univoco del media
   */
  id: number;
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
   * Descrizione del media
   */
  overview?: string;
  /**
   * Poster del media
   */
  poster_path?: string | null;
  /**
   * Backdrop del media
   */
  backdrop_path?: string | null;
  /**
   * Voto medio del media
   */
  vote_average?: number;
  /**
   * Numero di voti del media
   */
  vote_count?: number;
  /**
   * Data di rilascio del media
   */
  release_date?: string;
  /**
   * Data di messa in onda del media
   */
  first_air_date?: string;
  /**
   * Generi del media
   */
  genres?: { id: number; name: string }[];
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
 * Normalised media item (snake_case, used by the UI after passing through
 * {@link normalizeMediaItem}).
 */
export interface MediaItem {
  /**
   * ID univoco del media
   */
  id?: number;
  /**
   * ID univoco del media
   */
  tmdb_id: number;
  /**
   * Tipo di media
   */
  media_type: MediaType;
  /**
   * Titolo del media
   */
  title?: string;
  /**
   * Titolo originale del media
   */
  original_title?: string;
  /**
   * Descrizione del media
   */
  overview?: string;
  /**
   * Poster del media
   */
  poster_path?: string | null;
  /**
   * Backdrop del media
   */
  backdrop_path?: string | null;
  /**
   * Voto medio del media
   */
  vote_average?: number;
  /**
   * Numero di voti del media
   */
  vote_count?: number;
  /**
   * Data di rilascio del media
   */
  release_date?: string;
  /**
   * Generi del media
   */
  genres?: string;
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
 * Interfaccia per i generi
 */
export interface Genre {
  /**
   * ID univoco del genere
   */
  id: number;
  /**
   * Nome del genere
   */
  name: string;
}

/**
 * Interfaccia per i filtri dei media
 */
export interface MediaFilters {
  /**
   * Voto minimo del media
   */
  minRating: number;
  /**
   * Voto massimo del media
   */
  maxRating: number;
  /**
   * Generi selezionati
   */
  selectedGenres: number[];
  /**
   * Anno di rilascio minimo del media
   */
  releaseYearFrom: number;
  /**
   * Anno di rilascio massimo del media
   */
  releaseYearTo: number;
  /**
   * Numero di voti minimo del media
   */
  minVoteCount: number;
}

/**
 * Interfaccia per l'utente
 */
export interface User {
  /**
   * ID univoco dell'utente
   */
  id: number;
  /**
   * Nome utente
   */
  username: string;
  /**
   * Email dell'utente
   */
  email: string;
}

/**
 * Interfaccia per la risposta di autenticazione
 */
export interface AuthResponse {
  /**
   * Token di autenticazione
   */
  token: string;
  /**
   * Utente autenticato
   */
  user: User;
}
/**
 * Interfaccia per risposte API composte da solo messaggio.
 */
export interface MessageResponse {
  /**
   * Messaggio restituito dall'API
   */
  message: string;
}

/**
 * Interfaccia per l'errore API
 */
export class ApiError extends Error {
  /**
   * Status HTTP dell'errore
   */
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Interfaccia per l'errore TMDb
 */
export class TmdbError extends Error {
  /**
   * Status HTTP dell'errore
   */
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

/**
 * Interfaccia per la risposta di scoperta TMDb
 */
export interface TmdbDiscoverResult {
  /**
   * URL di scoperta
   */
  discoverUrl: string;
  /**
   * Numero totale di pagine
   */
  totalPages: number;
}

/**
 * Interfaccia per la pagina TMDb
 */
export interface TmdbPageResponse {
  /**
   * Numero di pagina
   */
  page: number;
  /**
   * Risultati TMDb
   */
  results: TmdbMedia[];
  /**
   * Numero totale di pagine
   */
  total_pages: number;
  /**
   * Numero totale di risultati
   */
  total_results: number;
}

/**
 * Interfaccia per la lista di generi TMDb
 */
export interface TmdbGenreListResponse {
  /**
   * Lista dei generi
   */
  genres: Genre[];
}

/**
 * Interfaccia per la risposta dei video TMDb
 */
export interface TmdbVideosResponse {
  /**
   * ID del media
   */
  id: number;
  /**
   * Risultati dei video
   */
  results: {
    key: string;
    name: string;
    site: string;
    type: string;
  }[];
}
