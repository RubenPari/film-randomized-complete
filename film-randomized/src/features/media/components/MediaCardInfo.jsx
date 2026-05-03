import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OVERVIEW_MAX_LENGTH } from '../../../shared/constants/config.js';

/**
 * Info panel of the detailed media card: title + year, rating + genres,
 * and the expandable description block. Owns only the expand/collapse
 * state — everything else is derived from props.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {number|null} props.year
 * @param {number} props.voteAverage
 * @param {Array<{ id: number, name: string }>} [props.genres]
 * @param {string} [props.overview]
 * @param {React.ReactNode} [props.children] Action slot (save buttons etc.)
 */
function MediaCardInfo({ title, year, voteAverage, genres, overview, children }) {
  const { t } = useTranslation();
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const hasLongOverview = Boolean(overview && overview.length > OVERVIEW_MAX_LENGTH);
  const toggleOverview = () => setIsOverviewExpanded((prev) => !prev);

  return (
    <div className="md:w-3/5 p-6">
      <h2 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
        {title}
        {year && (
          <span className="ml-2 text-gray-400 font-normal text-2xl">({year})</span>
        )}
      </h2>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg shadow-amber-500/30">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {voteAverage.toFixed(1)}/10
        </span>
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="genre-badge">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {overview && (
        <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p className="text-gray-300 leading-relaxed">
            {isOverviewExpanded || !hasLongOverview
              ? overview
              : `${overview.substring(0, 280)}...`}
          </p>
          {hasLongOverview && (
            <button
              type="button"
              onClick={toggleOverview}
              aria-expanded={isOverviewExpanded}
              aria-label={
                isOverviewExpanded ? t('common.showLess') : t('common.showMore')
              }
              className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              {isOverviewExpanded ? t('common.showLess') : t('common.showMore')}
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

export default MediaCardInfo;
