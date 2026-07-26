import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import {
  addToWatchlist,
  checkInWatchlist,
  removeFromWatchlist,
} from '../../../shared/services/watchlistApi.js';
import { logger } from '../../../shared/utils/logger.js';
import type { MediaType, TmdbMedia } from '../../../shared/types/index.js';

interface SaveButtonsProps {
  media: TmdbMedia;
  mediaType: MediaType;
}

function SaveButtons({ media, mediaType }: SaveButtonsProps) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const checkStatus = async () => {
      try {
        setIsInWatchlist(await checkInWatchlist(media.id as number, token));
      } catch (statusError) {
        logger.error('SaveButtons.checkWatchlist', statusError);
      }
    };

    void checkStatus();
  }, [media.id, token]);

  const handleToggle = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(media.id as number, token);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist(media, mediaType, token);
        setIsInWatchlist(true);
      }
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : t(isInWatchlist ? 'media.removeError' : 'media.saveError')
      );
      logger.error('SaveButtons.toggleWatchlist', mutationError);
    } finally {
      setIsLoading(false);
    }
  };

  const statusLabel = isLoading
    ? t(isInWatchlist ? 'media.removing' : 'media.adding')
    : t(isInWatchlist ? 'media.saved' : 'media.save');

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-pressed={isInWatchlist}
        aria-busy={isLoading}
        className={`ui-button w-full sm:w-auto ${
          isInWatchlist ? 'ui-button--secondary' : 'ui-button--primary'
        }`}
      >
        {isLoading ? (
          <span className="ui-spinner" aria-hidden="true" />
        ) : (
          <AppIcon name={isInWatchlist ? 'check' : 'bookmark'} />
        )}
        {statusLabel}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {statusLabel}
      </span>
      {error && (
        <p className="mt-3 border-2 border-danger bg-white p-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default SaveButtons;
