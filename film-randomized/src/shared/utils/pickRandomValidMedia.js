import {
  filterValidMedia,
  getRandomMedia,
  getRandomPage,
  hasValidDescription,
  isExcludedForCurrentType,
  resolveMediaTypeString,
} from './mediaUtils.js';

/**
 * Pure async picker for the random-media flow. Extracted from the old
 * `useMediaFetcher` so it can be unit-tested without React, a token, or
 * network access: every external dependency is injected via `fetchPage` /
 * `fetchDetails`.
 *
 * The algorithm:
 *   1. Pick a random page from `[1, totalPages]`.
 *   2. Apply `filterValidMedia` to drop excluded ids + rows without a usable
 *      overview.
 *   3. If nothing survives, retry up to `maxAttempts` times.
 *   4. Otherwise fetch the details for a random survivor and double-check
 *      that the details row itself is still valid (some summaries lie about
 *      overviews), retrying on failure.
 *
 * @param {Object} params
 * @param {(page: number) => Promise<{ results: Array<Object> }>} params.fetchPage
 *   Fetches one page of TMDb discover results. Usually bound to a specific
 *   discoverUrl outside this function.
 * @param {(mediaType: 'movie'|'tv', id: number) => Promise<Object>} params.fetchDetails
 *   Fetches the detail payload for a candidate media row.
 * @param {number} params.totalPages
 * @param {'movie'|'tv'|boolean} params.mediaType
 *   Accepts legacy boolean shape for callers still in transition.
 * @param {Array<Object>} [params.excludedItems]
 * @param {number} [params.maxAttempts]
 * @returns {Promise<Object>} The detail payload for the selected media.
 * @throws {Error} When no candidate survives after `maxAttempts`.
 */
export async function pickRandomValidMedia({
  fetchPage,
  fetchDetails,
  totalPages,
  mediaType,
  excludedItems = [],
  maxAttempts = 5,
}) {
  const mt = resolveMediaTypeString(mediaType);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const page = getRandomPage(totalPages);
    const pageData = await fetchPage(page);
    const candidates = filterValidMedia(
      pageData?.results ?? [],
      excludedItems,
      mediaType,
    );

    if (candidates.length === 0) continue;

    const candidate = getRandomMedia(candidates);
    const details = await fetchDetails(mt, candidate.id);

    if (
      hasValidDescription(details) &&
      !isExcludedForCurrentType(details.id, mt, excludedItems)
    ) {
      return details;
    }
  }

  throw new Error('No content found. Try modifying the filters.');
}
