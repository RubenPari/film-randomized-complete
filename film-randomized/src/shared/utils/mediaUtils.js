/**
 * Utility functions for media filtering and selection.
 * Provides helper functions for processing media data from TMDb API.
 */

/**
 * Filters out media that has already been viewed, is in the watchlist, or doesn't have a valid description.
 * 
 * @param {Array<Object>} results - Array of media items from API
 * @param {Array<Object>} viewedMedia - Array of already viewed media items
 * @param {Array<Object>} watchlist - Array of items in the user's watchlist
 * @returns {Array<Object>} Filtered array of valid media items
 */
export function filterValidMedia(results, viewedMedia, watchlist = []) {
    return results.filter(
        function(media) {
            // Check if already viewed in this session
            const isViewed = viewedMedia.some(function(viewed) { 
                return viewed.id === media.id; 
            });

            // Check if already in user's watchlist
            const isInWatchlist = watchlist.some(function(item) {
                return item.tmdb_id === media.id;
            });

            return !isViewed && !isInWatchlist &&
            media.overview &&
            media.overview.trim() !== '' &&
            media.overview !== 'Nessuna descrizione disponibile in italiano.';
        }
    );
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
