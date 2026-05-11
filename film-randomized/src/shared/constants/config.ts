/**
 * App-wide tuning values (single source for magic numbers).
 */

export const OVERVIEW_MAX_LENGTH = 280;

export const MAX_GENERATION_ATTEMPTS = 5;

export const MIN_RELEASE_YEAR = 1900;

/** TMDb discovery API caps reported total_pages at this value. */
export const TMDB_MAX_PAGE = 500;

/** Minimum vote-count presets (aligned with VoteCountFilter labels). */
export const VOTE_COUNT_THRESHOLDS: number[] = [0, 1000, 10000, 50000, 75000];
