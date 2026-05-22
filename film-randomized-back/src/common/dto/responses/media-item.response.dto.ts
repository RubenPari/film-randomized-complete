import { Expose } from 'class-transformer';
import { MediaType } from '../../enums/media-type.enum.js';

export class MediaItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  tmdbId: number;

  @Expose()
  mediaType: MediaType;

  @Expose()
  title: string;

  @Expose()
  originalTitle: string | null;

  @Expose()
  overview: string | null;

  @Expose()
  posterPath: string | null;

  @Expose()
  backdropPath: string | null;

  @Expose()
  voteAverage: number | null;

  @Expose()
  voteCount: number | null;

  @Expose()
  releaseDate: string | null;

  @Expose()
  genres: string | null;

  @Expose()
  runtime: number | null;

  @Expose()
  numberOfSeasons: number | null;

  @Expose()
  numberOfEpisodes: number | null;

  @Expose()
  createdAt: Date;
}
