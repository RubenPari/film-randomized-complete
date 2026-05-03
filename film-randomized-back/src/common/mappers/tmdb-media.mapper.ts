import { TmdbMediaPayloadDto } from '../dto/tmdb-media-payload.dto.js';
import { BaseMediaItem } from '../../entities/base-media-item.entity.js';
import { MediaType } from '../enums/media-type.enum.js';

export type MediaItemConstructor<T extends BaseMediaItem> = new () => T;

/**
 * Builds a fresh media-collection entity from a TMDb-shaped payload.
 *
 * The same mapping is needed by every consumer of `TmdbMediaPayloadDto`
 * (`WatchlistService.create`, `DiscoveredService.record`, future bookmarks…).
 * Extracting it here is the single source of truth — bug fixes or new fields
 * are made in one place.
 *
 * @param ctor   Concrete entity constructor (e.g. `WatchlistItem`).
 * @param userId Owning user id; baked into the new row.
 * @param dto    Validated payload coming from the controller.
 */
export function buildMediaItemFromTmdbPayload<T extends BaseMediaItem>(
  ctor: MediaItemConstructor<T>,
  userId: string,
  dto: TmdbMediaPayloadDto,
): T {
  const item = new ctor();
  item.tmdbId = dto.tmdb_id;
  item.mediaType = dto.media_type as MediaType;
  item.title = dto.title;
  item.originalTitle = dto.original_title ?? null;
  item.overview = dto.overview ?? null;
  item.posterPath = dto.poster_path ?? null;
  item.backdropPath = dto.backdrop_path ?? null;
  item.voteAverage = dto.vote_average ?? null;
  item.voteCount = dto.vote_count ?? null;
  item.releaseDate = dto.release_date ?? null;
  item.genres = dto.genres ?? null;
  item.runtime = dto.runtime ?? null;
  item.numberOfSeasons = dto.number_of_seasons ?? null;
  item.numberOfEpisodes = dto.number_of_episodes ?? null;
  item.userId = userId;
  return item;
}
