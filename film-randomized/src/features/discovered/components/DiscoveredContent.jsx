/**
 * Discovered titles grid: promise resolution, filter, remove.
 */
import React, { useState, useEffect, use, startTransition } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { removeDiscovered } from '../../../shared/services/discoveredApi.js';
import { getMediaType, matchesMediaListFilter } from '../../../shared/utils/mediaUtils.js';
import WatchlistItemCard from '../../watchlist/components/WatchlistItemCard.jsx';

/**
 * @param {Object} props
 * @param {Promise} props.discoveredPromise
 * @param {string} props.filter - 'all' | 'movies' | 'tv'
 * @param {string} props.token
 */
function DiscoveredContent({ discoveredPromise, filter, token }) {
  const { t } = useTranslation();
  const initialList = use(discoveredPromise);

  const [items, setItems] = useState(initialList);

  useEffect(() => {
    setItems(initialList);
  }, [initialList]);

  const handleRemove = async (tmdbId, mediaType) => {
    if (!token) return;

    startTransition(() => {
      setItems((prev) =>
        prev.filter((item) => {
          const id = item.tmdb_id ?? item.tmdbId;
          const mt = getMediaType(item) ?? 'movie';
          return !(id === tmdbId && mt === mediaType);
        }),
      );
    });

    try {
      await removeDiscovered(mediaType, tmdbId, token);
    } catch (err) {
      console.error('Error removing discovered item:', err);
    }
  };

  const filtered = items.filter((item) => matchesMediaListFilter(item, filter));

  if (filtered.length === 0) {
    return (
      <div className="text-center py-24 px-6">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <svg className="w-16 h-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <h2 className="text-slate-200 text-3xl font-bold mb-3">
          {filter === 'all'
            ? t('discovered.empty')
            : filter === 'movies'
              ? t('discovered.emptyMovies')
              : t('discovered.emptyTv')}
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          {filter === 'all'
            ? t('discovered.emptyDescription')
            : t('watchlist.emptyFilterDescription', {
                type:
                  filter === 'movies'
                    ? t('common.movies').toLowerCase()
                    : t('common.tvShows').toLowerCase(),
              })}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('discovered.generateMore')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 px-6 py-4 rounded-2xl glass-effect border border-slate-700/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">
              {t('discovered.totalItems')}
            </p>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {filtered.length}
            </p>
          </div>
          <div className="hidden md:block text-slate-600">
            <p className="text-sm">
              {filtered.length}{' '}
              {filtered.length === 1 ? t('watchlist.item') : t('watchlist.items')}{' '}
              {t('discovered.inList')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
        {filtered.map((item) => (
          <WatchlistItemCard key={item.id} item={item} onRemove={handleRemove} />
        ))}
      </div>
    </>
  );
}

export default DiscoveredContent;
