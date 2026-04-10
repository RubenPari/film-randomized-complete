/**
 * Utility functions for media filtering and selection.
 * Provides helper functions for processing media data from TMDb API.
 */

/**
 * @param {Object} item - Watchlist or discovered row (normalized or API)
 * @returns {'movie'|'tv'|null}
 */
function normalizeItemMediaType(item) {
  let mt = item.media_type ?? item.mediaType;
  if (mt === true) return 'movie';
  if (mt === false) return 'tv';
  if (mt === 'movie' || mt === 'tv') return mt;
  return null;
}

/**
 * @param {boolean|'movie'|'tv'} mediaType - Current generator mode
 * @returns {'movie'|'tv'}
 */
export function resolveMediaTypeString(mediaType) {
  return mediaType === true || mediaType === 'movie' ? 'movie' : 'tv';
}

/**
 * Whether this tmdb id is excluded for the current bucket (same media type only).
 *
 * @param {number} tmdbId - TMDb id for current list (movie or tv)
 * @param {'movie'|'tv'} currentMediaType
 * @param {Array<Object>} excludedItems - Watchlist and/or discovered rows
 * @returns {boolean}
 */
export function isExcludedForCurrentType(tmdbId, currentMediaType, excludedItems) {
  if (!excludedItems || excludedItems.length === 0) return false;
  return excludedItems.some(function (item) {
    const id = item.tmdb_id ?? item.tmdbId;
    const mt = normalizeItemMediaType(item);
    return id === tmdbId && mt === currentMediaType;
  });
}

/**
 * Filters out media in the exclusion list (watchlist + discovered) or without a valid description.
 *
 * @param {Array<Object>} results - Array of media items from API
 * @param {Array<Object>} excludedItems - Items to skip (watchlist + discovered)
 * @param {boolean|'movie'|'tv'} currentMediaType - Active generator mode
 * @returns {Array<Object>} Filtered array of valid media items
 */
export function filterValidMedia(results, excludedItems = [], currentMediaType) {
  const mt = resolveMediaTypeString(currentMediaType);
  return results.filter(function (media) {
    const excluded = isExcludedForCurrentType(media.id, mt, excludedItems);

    return (
      !excluded &&
      media.overview &&
      media.overview.trim() !== '' &&
      media.overview !== 'Nessuna descrizione disponibile in italiano.'
    );
  });
}

/**
 * Checks if a media item has a valid description in Italian.
 * 
 * @param {Object} media - Media object to check
 * @param {string} media.overview - The media overview/description
 * @returns {boolean} True if media has a valid description
 */
export function hasValidDescription(media) {
    return media.overview &&
        media.overview.trim() !== '' &&
        media.overview !== 'Nessuna descrizione disponibile in italiano.';
}

/**
 * Generates a random page number within the total pages.
 * 
 * @param {number} totalPages - Total number of pages available
 * @returns {number} Random page number between 1 and totalPages
 */
export function getRandomPage(totalPages) {
    return Math.floor(Math.random() * totalPages) + 1;
}

/**
 * Selects a random media item from an array.
 * 
 * @param {Array<Object>} mediaArray - Array of media items
 * @returns {Object} Randomly selected media item
 */
export function getRandomMedia(mediaArray) {
    const randomIndex = Math.floor(Math.random() * mediaArray.length);
    return mediaArray[randomIndex];
}
