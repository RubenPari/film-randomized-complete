import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MediaType } from '../enums/media-type.enum.js';

/**
 * Payload di input per film/serie TV, sia per la watchlist che per la lista scoperta.
 */
export class TmdbMediaPayloadDto {
  /**
   * ID di TMDB
   */
  @IsInt()
  @Min(1)
  tmdb_id!: number;

  /**
   * Tipo di media
   */
  @IsEnum(MediaType)
  media_type!: MediaType;

  /**
   * Titolo
   */
  @IsString()
  @MaxLength(500)
  title!: string;

  /**
   * Titolo originale
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  original_title?: string | null;

  /**
   * Panoramica
   */
  @IsOptional()
  @IsString()
  overview?: string | null;

  /**
   * Percorso del poster
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  poster_path?: string | null;

  /**
   * Percorso del backdrop
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  backdrop_path?: string | null;

  /**
   * Voto medio
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  vote_average?: number | null;

  /**
   * Conteggio voti
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  vote_count?: number | null;

  /**
   * Data di rilascio
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  release_date?: string | null;

  /**
   * Generi
   */
  @IsOptional()
  @IsString()
  genres?: string | null;

  /**
   * Durata
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  runtime?: number | null;

  /**
   * Numero di stagioni
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  number_of_seasons?: number | null;

  /**
   * Numero di episodi
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  number_of_episodes?: number | null;
}
