/**
 * Watchlist content component.
 * Handles promise resolution and displays filtered watchlist items.
 */
import React, { useState, useEffect, use, startTransition } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { removeFromWatchlist } from '../../../shared/services/watchlistApi.js';
import WatchlistItemCard from './WatchlistItemCard.jsx';

/**
 * Watchlist content component that handles promise resolution.
 *
 * @param {Object} props - Component props
 * @param {Promise} props.watchlistPromise - Promise resolving to watchlist data
 * @param {string} props.filter - Filter type: 'all', 'movies', or 'tv'
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element} Watchlist content
 */
function WatchlistContent({ watchlistPromise, filter, token }) {
  const { t } = useTranslation();
  const initialWatchlist = use(watchlistPromise);

  // Local watchlist state derived from initial data
  const [watchlist, setWatchlist] = useState(initialWatchlist);

  useEffect(() => {
    // Keep local state in sync if the underlying data changes (e.g., token change)
    setWatchlist(initialWatchlist);
  }, [initialWatchlist]);

  /**
   * Handles removing an item from the watchlist.
   *
   * @param {number} tmdbId - TMDB ID of the item to remove
   */
  const handleRemove = async (tmdbId) => {
    if (!token) return;

    startTransition(() => {
      setWatchlist((prev) => prev.filter((item) => item.tmdb_id !== tmdbId));
    });

    try {
      await removeFromWatchlist(tmdbId, token);
      // Data is already optimistically updated
    } catch (err) {
      console.error('Error removing item:', err);
      // In a real app we'd probably trigger a toast or re-throw to revert
    }
  };

  const filteredWatchlist = watchlist.filter((item) => {
    if (filter === 'movies') return item.media_type === true;
    if (filter === 'tv') return item.media_type === false;
    return true;
  });

  if (filteredWatchlist.length === 0) {
    return (
      <div className="text-center py-24 px-6">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <svg className="w-16 h-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-slate-200 text-3xl font-bold mb-3">
          {filter === 'all'
            ? t('watchlist.empty')
            : filter === 'movies' ? t('watchlist.emptyMovies') : t('watchlist.emptyTv')}
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          {filter === 'all'
            ? t('watchlist.emptyDescription')
            : t('watchlist.emptyFilterDescription', { type: filter === 'movies' ? t('common.movies').toLowerCase() : t('common.tvShows').toLowerCase() })}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('watchlist.discoverContent')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 px-6 py-4 rounded-2xl glass-effect border border-slate-700/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">{t('watchlist.totalItems')}</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {filteredWatchlist.length}
            </p>
          </div>
          <div className="hidden md:block text-slate-600">
            <p className="text-sm">{filteredWatchlist.length} {filteredWatchlist.length === 1 ? t('watchlist.item') : t('watchlist.items')} {t('home.sessionInfo')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
        {filteredWatchlist.map((item) => (
          <WatchlistItemCard key={item.id} item={item} onRemove={handleRemove} />
        ))}
      </div>
    </>
  );
}

export default WatchlistContent;
