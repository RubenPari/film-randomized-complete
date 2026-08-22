/**
 * Custom hook for fetching media trailers.
 * Fetches and selects the best available trailer video from TMDB.
 */
import { useState, useEffect } from 'react';
import { fetchMediaVideos } from '../../../shared/services/tmdbApi.js';
import { logger } from '../../../shared/utils/logger.js';
import type { MediaType, TmdbVideosResponse } from '../../../shared/types/index.js';

/**
 * Hook to fetch and select media trailer video.
 * Prioritizes YouTube trailers, then teasers, then any YouTube video.
 *
 * @param mediaType - Media type ('movie' | 'tv')
 * @param mediaId - TMDB ID of the media
 * @returns Trailer video key or null if no trailer found
 */
export default function useMediaTrailer(mediaType: MediaType, mediaId: number): string | null {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const loadTrailer = async () => {
      try {
        const videosData = (await fetchMediaVideos(mediaType, mediaId)) as TmdbVideosResponse;
        const videos = videosData.results || [];

        // 1. Try to find a YouTube Trailer
        let trailer = videos.find(
          (v: { site: string; type: string }) => v.site === 'YouTube' && v.type === 'Trailer'
        );

        // 2. If not found, try a Teaser
        if (!trailer) {
          trailer = videos.find(
            (v: { site: string; type: string }) => v.site === 'YouTube' && v.type === 'Teaser'
          );
        }

        // 3. If still not found, take the first available YouTube video
        if (!trailer) {
          trailer = videos.find((v: { site: string }) => v.site === 'YouTube');
        }

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (error) {
        logger.error('useMediaTrailer.load', error);
        setTrailerKey(null);
      }
    };

    if (mediaId) {
      loadTrailer();
    }
  }, [mediaId, mediaType]);

  return trailerKey;
}
