/**
 * Canonical media-type identifiers used across the app. Historically parts of
 * the codebase used booleans (`true` for movie / `false` for TV) inherited
 * from the original generator. That representation is gone — always pass one
 * of these string constants instead.
 */
export const MEDIA_TYPE = Object.freeze({
  MOVIE: 'movie',
  TV: 'tv',
});

/**
 * Accepts legacy boolean inputs as a transitional escape hatch and coerces
 * them into the canonical string. New code should never pass booleans.
 *
 * @param {boolean|'movie'|'tv'} value
 * @returns {'movie'|'tv'}
 */
export function toMediaType(value) {
  if (value === MEDIA_TYPE.MOVIE || value === MEDIA_TYPE.TV) return value;
  return value === true ? MEDIA_TYPE.MOVIE : MEDIA_TYPE.TV;
}

/** @param {'movie'|'tv'} value */
export function isMovie(value) {
  return value === MEDIA_TYPE.MOVIE;
}

/** @param {'movie'|'tv'} value */
export function isTv(value) {
  return value === MEDIA_TYPE.TV;
}
