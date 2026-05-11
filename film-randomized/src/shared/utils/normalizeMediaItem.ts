import { MediaType } from '../types/index.js';

export interface NormalizableItem extends Record<string, unknown> {
  id?: number;
  tmdb_id?: number;
  tmdbId?: number | string;
  media_type?: MediaType | string | boolean;
  mediaType?: boolean | MediaType | string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  originalTitle?: string;
  overview?: string;
  poster_path?: string | null;
  posterPath?: string | null;
  backdrop_path?: string | null;
  backdropPath?: string | null;
  vote_average?: number;
  voteAverage?: number;
  vote_count?: number;
  voteCount?: number;
  release_date?: string;
  releaseDate?: string;
  first_air_date?: string;
  genres?: unknown;
  runtime?: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
}

export function normalizeMediaItem(
  item: NormalizableItem | null | undefined,
): NormalizableItem | null | undefined {
  if (!item || typeof item !== 'object') return item;

  const rawTmdb = item.tmdb_id ?? item.tmdbId;
  const tmdb_id = typeof rawTmdb === 'string' ? Number(rawTmdb) : rawTmdb;

  let media_type: MediaType | string | boolean | undefined = item.media_type ?? item.mediaType;
  if (media_type === true) media_type = 'movie';
  if (media_type === false) media_type = 'tv';

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

export function getMediaItemKey(item: NormalizableItem): string {
  const id = item.tmdb_id ?? item.tmdbId;
  const mt = item.media_type ?? item.mediaType ?? 'movie';
  return `${mt}-${id}`;
}
