/**
 * Media card component.
 * Displays detailed information about a media item including poster, title, description, and trailer.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';
import { OVERVIEW_MAX_LENGTH } from '../../../shared/constants/config.js';
import useMediaTrailer from '../hooks/useMediaTrailer.js';
import SaveButtons from './SaveButtons.jsx';

/**
 * Component for displaying detailed information about a media item.
 * Shows poster, title, description, rating, genres, and optional trailer video.
 *
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object with details to display
 * @param {number} props.media.id - TMDB ID of the media
 * @param {string} props.media.title - Title (for movies)
 * @param {string} props.media.name - Title (for TV shows)
 * @param {string} props.media.overview - Description/overview
 * @param {string} props.media.poster_path - Poster image path
 * @param {number} props.media.vote_average - Average vote rating
 * @param {Array<Object>} props.media.genres - Array of genre objects
 * @param {boolean} props.mediaType - Type of media (true for movie, false for TV show)
 * @returns {JSX.Element} Media card component
 */
function MediaCard({ media, mediaType }) {
  const { t } = useTranslation();
  // Extract title based on media type (movie or TV show)
  const title = media.title || media.name;

  // Extract release date and year
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // Fetch trailer using custom hook
  const trailerKey = useMediaTrailer(mediaType, media.id);

  // State for description expansion
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const hasLongOverview = Boolean(media.overview && media.overview.length > OVERVIEW_MAX_LENGTH);

  return (
    <div className="media-card">
      <div className="flex flex-col md:flex-row">
        {/* Poster section */}
        <div className="md:w-2/5 relative group overflow-hidden rounded-l-xl">
          {media.poster_path ? (
            <div className="relative overflow-hidden">
              <img
                src={`${IMAGE_BASE_URL}${media.poster_path}`}
                alt={title}
                className="media-poster transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            // Display placeholder when no poster is available
            <div className="bg-slate-800 h-full flex items-center justify-center p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-2 text-slate-500">{t('common.noImage')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Information section */}
        <div className="md:w-3/5 p-6">
          <h2 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            {title}
            {year && <span className="ml-2 text-gray-400 font-normal text-2xl">({year})</span>}
          </h2>

          {/* Rating and genres display */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg shadow-amber-500/30">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {media.vote_average.toFixed(1)}/10
            </span>
            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {media.genres.slice(0, 3).map(function (genre) {
                  return (
                    <span key={genre.id} className="genre-badge">
                      {genre.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description with expand/collapse */}
          {media.overview && (
            <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-gray-300 leading-relaxed">
                {isOverviewExpanded || !hasLongOverview
                  ? media.overview
                  : `${media.overview.substring(0, 280)}...`}
              </p>
              {hasLongOverview && (
                <button
                  onClick={function () {
                    setIsOverviewExpanded(function (prev) {
                      return !prev;
                    });
                  }}
                  className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                >
                  {isOverviewExpanded ? t('common.showLess') : t('common.showMore')}
                </button>
              )}
            </div>
          )}

          {/* Save buttons */}
          <SaveButtons media={media} mediaType={mediaType} />
        </div>
      </div>

      {/* Trailer section */}
      {trailerKey && (
        <div className="p-6 pt-0 mt-4 md:mt-0 md:px-6 md:pb-6">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {t('common.trailer')}
          </h3>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={t('common.trailer')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaCard;
