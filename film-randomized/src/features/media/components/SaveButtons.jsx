/**
 * Component for saving media items to watchlist.
 * Handles adding and removing items from the user's watchlist.
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import {
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist,
} from '../../../shared/services/watchlistApi.js';

/**
 * Save buttons component for watchlist management.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object to save
 * @param {number} props.media.id - TMDB ID of the media
 * @param {boolean} props.mediaType - true for movie, false for TV show
 * @returns {JSX.Element} Save buttons component
 */
function SaveButtons({ media, mediaType }) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Checks if media is already in watchlist on mount.
   */
  useEffect(
    function () {
      if (!token) return;
      
      const checkStatus = async function () {
        try {
          const inWatchlist = await checkInWatchlist(media.id, token);
          setIsInWatchlist(inWatchlist);
        } catch (err) {
          console.error('Error checking watchlist status:', err);
        }
      };

      checkStatus();
    },
    [media.id, token]
  );

  /**
   * Handles adding media to watchlist.
   */
  const handleAddToWatchlist = async function () {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await addToWatchlist(media, mediaType, token);
      setIsInWatchlist(true);
    } catch (err) {
      setError(err.message);
      console.error('Error adding to watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles removing media from watchlist.
   */
  const handleRemoveFromWatchlist = async function () {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await removeFromWatchlist(media.id, token);
      setIsInWatchlist(false);
    } catch (err) {
      setError(err.message);
      console.error('Error removing from watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-3 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-700/50 flex items-start gap-2">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        {!isInWatchlist ? (
          <button
            onClick={handleAddToWatchlist}
            disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-2 flex-1 font-bold hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/30"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                {t('media.adding')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t('media.save')}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleRemoveFromWatchlist}
            disabled={isLoading}
            className="btn-secondary flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-green-500 text-white font-bold hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/30"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                {t('media.removing')}
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {t('media.saved')}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default SaveButtons;
