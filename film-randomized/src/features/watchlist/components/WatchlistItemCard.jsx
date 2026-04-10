/**
 * Watchlist item card component.
 * Displays a single watchlist item with poster, title, and remove button.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';

/**
 * Watchlist item card component.
 *
 * @param {Object} props - Component props
 * @param {Object} props.item - Watchlist item data
 * @param {Function} props.onRemove - Callback to remove item from watchlist
 * @returns {JSX.Element} Watchlist item card
 */
function WatchlistItemCard({ item, onRemove }) {
  const { t } = useTranslation();
  const genres = item.genres ? JSON.parse(item.genres) : [];

  return (
    <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/40 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
      <div className="relative">
        <a
          href={`https://www.themoviedb.org/${item.media_type ? 'movie' : 'tv'}/${item.tmdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[2/3] bg-slate-900 overflow-hidden group/poster"
          title={t('media.onTmdb', { title: item.title })}
        >
          {item.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-xl rounded-lg text-xs font-bold text-white shadow-lg border border-cyan-400/30">
            {item.media_type ? t('common.movies').slice(0, -1) : 'TV'}
          </div>
        </a>

        <button
          onClick={() => {
            onRemove(item.tmdb_id);
          }}
          className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl z-10 transform hover:scale-110"
          title={t('media.remove')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-300 transition-colors duration-300">
          {item.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 space-x-2">
          {item.release_date && (
            <span className="px-2 py-1 bg-slate-700/40 rounded-md font-medium">
              {new Date(item.release_date).getFullYear()}
            </span>
          )}
          {item.vote_average && (
            <span className="text-amber-400 flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 rounded-md font-semibold">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {genres.slice(0, 2).map((genre) => (
              <span key={genre.id} className="text-xs px-2.5 py-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-colors duration-300 font-medium backdrop-blur-sm">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchlistItemCard;
