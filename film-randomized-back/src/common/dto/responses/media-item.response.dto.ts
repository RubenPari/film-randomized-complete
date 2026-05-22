import { Expose } from 'class-transformer';
import { MediaType } from '../../enums/media-type.enum.js';

/**
 * Risposta per un item multimediale
 */
export class MediaItemResponseDto {
  /**
   * ID dell'item
   */
  @Expose()
  id: string;

  /**
   * ID di TMDB
   */
  @Expose()
  tmdbId: number;

  /**
   * Tipo di media
   */
  @Expose()
  mediaType: MediaType;

  /**
   * Titolo
   */
  @Expose()
  title: string;

  /**
   * Titolo originale
   */
  @Expose()
  originalTitle: string | null;

  /**
   * Panoramica
   */
  @Expose()
  overview: string | null;

  /**
   * Percorso del poster
   */
  @Expose()
  posterPath: string | null;

  /**
   * Percorso del backdrop
   */
  @Expose()
  backdropPath: string | null;

  /**
   * Voto medio
   */
  @Expose()
  voteAverage: number | null;

  /**
   * Conteggio voti
   */
  @Expose()
  voteCount: number | null;

  /**
   * Data di rilascio
   */
  @Expose()
  releaseDate: string | null;

  /**
   * Generi
   */
  @Expose()
  genres: string | null;

  /**
   * Durata
   */
  @Expose()
  runtime: number | null;

  /**
   * Numero di stagioni
   */
  @Expose()
  numberOfSeasons: number | null;

  /**
   * Numero di episodi
   */
  @Expose()
  numberOfEpisodes: number | null;

  /**
   * Data di creazione
   */
  @Expose()
  createdAt: Date;
}
