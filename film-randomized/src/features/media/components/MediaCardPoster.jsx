import React from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';

/**
 * Large poster panel for the detailed media card. Renders a placeholder
 * SVG when TMDb has no poster for the row.
 *
 * @param {Object} props
 * @param {string|null|undefined} props.posterPath
 * @param {string} props.title
 */
function MediaCardPoster({ posterPath, title }) {
  const { t } = useTranslation();

  if (!posterPath) {
    return (
      <div className="md:w-2/5 relative bg-slate-800 h-full flex items-center justify-center p-8 rounded-l-xl">
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
    );
  }

  return (
    <div className="md:w-2/5 relative group overflow-hidden rounded-l-xl">
      <div className="relative overflow-hidden">
        <img
          src={`${IMAGE_BASE_URL}${posterPath}`}
          alt={title}
          className="media-poster transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}

export default MediaCardPoster;
