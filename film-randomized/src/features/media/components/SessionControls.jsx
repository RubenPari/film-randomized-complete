/**
 * Session controls component.
 * Handles import/export of viewed media session.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SESSION_MESSAGE_TIMEOUT_MS } from '../../../shared/constants/config.js';

/**
 * Session controls component.
 * Displays viewed media count and provides import/export functionality.
 *
 * @param {Object} props - Component props
 * @param {Array} props.viewedMedia - Array of viewed media items
 * @param {Function} props.exportViewedMedia - Function to export viewed media
 * @param {Function} props.importViewedMedia - Function to import viewed media
 * @returns {JSX.Element} Session controls component
 */
function SessionControls({ viewedMedia, exportViewedMedia, importViewedMedia }) {
  const { t } = useTranslation();
  const [importMessage, setImportMessage] = useState({ text: '', type: '' });

  /**
   * Handles file import for viewed media.
   *
   * @param {Object} e - File input change event
   */
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importViewedMedia(event.target.result);
      if (success) {
        setImportMessage({ text: t('home.importSuccess'), type: 'success' });
      } else {
        setImportMessage({ text: t('home.importError'), type: 'error' });
      }
      // Reset message after 3 seconds
      setTimeout(() => setImportMessage({ text: '', type: '' }), SESSION_MESSAGE_TIMEOUT_MS);
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="p-6 glass-effect rounded-xl border border-cyan-500/20 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 border-b border-cyan-500/10 pb-4">
        <div className="text-center md:text-left">
          <span className="text-cyan-400 font-bold text-lg block md:inline">
            {t('home.discoveredCount', { count: viewedMedia.length })}
          </span>
          <span className="text-gray-400 text-sm ml-0 md:ml-2">{t('home.sessionInfo')}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportViewedMedia}
            disabled={viewedMedia.length === 0}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title={viewedMedia.length === 0 ? 'Generate content first to export' : ''}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {t('home.exportSession')}
          </button>
          <label className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2 hover:bg-slate-700 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {t('home.importSession')}
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Import feedback message */}
      {importMessage.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm text-center animate-fade-in ${
            importMessage.type === 'success'
              ? 'bg-green-900/40 text-green-200'
              : 'bg-red-900/40 text-red-200'
          }`}
        >
          {importMessage.text}
        </div>
      )}

      {viewedMedia.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {viewedMedia.map(function (media, index) {
            const title = media.title || media.name;
            const posterPath = media.poster_path;
            return (
              <div
                key={media.id || index}
                className="flex flex-col items-center gap-2 text-sm text-white font-semibold p-3 bg-slate-800/80 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                    alt={title}
                    className="w-full h-auto object-cover rounded shadow-md"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-slate-700 rounded flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-600"
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
                  </div>
                )}
                <span className="text-center text-xs line-clamp-2">{title}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm italic">{t('session.empty')}</div>
      )}
    </div>
  );
}

export default SessionControls;
