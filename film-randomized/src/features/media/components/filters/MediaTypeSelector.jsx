/**
 * Media type selector component.
 * Allows users to switch between movies and TV shows.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component for selecting between movies and TV shows.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.mediaType - Current media type (true for movie, false for TV show)
 * @param {Function} props.setMediaType - Function to update media type
 * @returns {JSX.Element} Media type selector component
 */
function MediaTypeSelector({ mediaType, setMediaType }) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="filter-title">{t('filters.mediaType')}</h2>
      <div className="flex space-x-3">
        <button
          onClick={function() { setMediaType(true); }}
          className={`btn-secondary flex-1 flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${
            mediaType
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
          </svg>
          {t('common.movies')}
        </button>
        <button
          onClick={function() { setMediaType(false); }}
          className={`btn-secondary flex-1 flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${
            !mediaType
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          {t('common.tvShows')}
        </button>
      </div>
    </div>
  );
}

export default MediaTypeSelector;
