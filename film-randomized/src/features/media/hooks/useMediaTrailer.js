/**
 * Custom hook for fetching media trailers.
 * Fetches and selects the best available trailer video from TMDB.
 */
import { useState, useEffect } from 'react';
import { fetchMediaVideos } from '../../../shared/services/tmdbApi.js';

/**
 * Hook to fetch and select media trailer video.
 * Prioritizes YouTube trailers, then teasers, then any YouTube video.
 *
 * @param {boolean} mediaType - True for movies, false for TV shows
 * @param {number} mediaId - TMDB ID of the media
 * @returns {string|null} Trailer video key or null if no trailer found
 */
const useMediaTrailer = (mediaType, mediaId) => {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const loadTrailer = async () => {
      try {
        const videosData = await fetchMediaVideos(mediaType, mediaId);
        const videos = videosData.results || [];

        // 1. Try to find a YouTube Trailer
        let trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer');

        // 2. If not found, try a Teaser
        if (!trailer) {
          trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Teaser');
        }

        // 3. If still not found, take the first available YouTube video
        if (!trailer) {
          trailer = videos.find(v => v.site === 'YouTube');
        }

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (error) {
        console.error('Error loading trailer:', error);
        setTrailerKey(null);
      }
    };

    if (mediaId) {
      loadTrailer();
    }
  }, [mediaId, mediaType]);

  return trailerKey;
};

export default useMediaTrailer;
