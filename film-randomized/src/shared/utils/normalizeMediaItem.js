/**
 * Normalises a media-collection row coming back from the backend
 * (watchlist, discovered, …) into a UI-friendly snake_case shape.
 *
 * Why this exists:
 *   - The Nest/TypeORM JSON serialiser emits camelCase (`tmdbId`, `posterPath`),
 *     but every component on the frontend reads snake_case (`tmdb_id`,
 *     `poster_path`). Doing the conversion here is the single boundary —
 *     downstream code can stop sprinkling `item.tmdb_id ?? item.tmdbId`
 *     fallbacks everywhere.
 *   - Legacy rows in some browsers' state still carry boolean `mediaType`
 *     (the very early generator stored `true`/`false` for movie/tv); we
 *     coerce those into the canonical `'movie' | 'tv'` strings here.
 *
 * @param {Object} item - Raw row from the API.
 * @returns {Object} Normalised row with `tmdb_id`, `media_type`, `poster_path`,
 *                   `backdrop_path`, `original_title`, `vote_average`,
 *                   `vote_count`, `release_date` (snake_case).
 */
export function normalizeMediaItem(item) {
  if (!item || typeof item !== 'object') return item;

  const rawTmdb = item.tmdb_id ?? item.tmdbId;
  const tmdb_id = typeof rawTmdb === 'string' ? Number(rawTmdb) : rawTmdb;

  let media_type = item.media_type ?? item.mediaType;
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

/**
 * Stable identity key used by collection lists for filtering / removal.
 * A user may have the same `tmdb_id` as both a movie and a TV show, so the key
 * MUST include the media type to disambiguate.
 *
 * @param {Object} item - Normalised media item.
 * @returns {string} Identity key.
 */
export function getMediaItemKey(item) {
  const id = item.tmdb_id ?? item.tmdbId;
  const mt = item.media_type ?? item.mediaType ?? 'movie';
  return `${mt}-${id}`;
}
