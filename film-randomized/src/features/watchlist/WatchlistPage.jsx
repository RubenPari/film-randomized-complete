/**
 * Watchlist page component.
 * Displays and manages the user's watchlist with filtering capabilities.
 */
import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getWatchlist } from '../../shared/services/watchlistApi.js';
import ErrorBoundary from '../../shared/components/ErrorBoundary.jsx';
import WatchlistContent from './components/WatchlistContent.jsx';

/**
 * Dedicated watchlist page component.
 * Uses React 19 Suspense and ErrorBoundary.
 */
function WatchlistPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tv'
  const [watchlistPromise, setWatchlistPromise] = useState(null);

  useEffect(() => {
    if (token) {
      setWatchlistPromise(getWatchlist(token));
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="glass-effect border-b border-slate-700/50 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 transform" title={t('common.back')}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                {t('watchlist.title')}
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {t('common.all')}
              </button>
              <button
                onClick={() => setFilter('movies')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  filter === 'movies'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {t('common.movies')}
              </button>
              <button
                onClick={() => setFilter('tv')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  filter === 'tv'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {t('common.tvShows')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="loading-spinner mr-3"></div>
              <span className="text-slate-300 text-lg font-medium">{t('watchlist.loading')}</span>
            </div>
          }>
            {watchlistPromise && (
              <WatchlistContent
                watchlistPromise={watchlistPromise}
                filter={filter}
                token={token}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default WatchlistPage;
