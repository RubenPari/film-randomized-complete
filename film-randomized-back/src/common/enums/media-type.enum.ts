/**
 * Allowed values for the `mediaType` column on every media-collection entity
 * (watchlist, discovered, future bookmarks…). Mirrors the values accepted by
 * `TmdbMediaPayloadDto.media_type` and is enforced at the database level via a
 * Postgres ENUM type.
 */
export enum MediaType {
  MOVIE = 'movie',
  TV = 'tv',
}

export const MEDIA_TYPE_VALUES = Object.values(MediaType);
