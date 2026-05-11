/**
 * Watchlist page component.
 * Displays and manages the user's watchlist with filtering capabilities.
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getWatchlist } from '../../shared/services/watchlistApi.js';
import FilteredCollectionPageLayout from '../../shared/components/FilteredCollectionPageLayout.jsx';
import WatchlistContent from './components/WatchlistContent.jsx';
import type { MediaItem } from '../../shared/types/index.js';

function WatchlistPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [filter, setFilter] = useState<'all' | 'movies' | 'tv'>('all');
  const [watchlistPromise, setWatchlistPromise] = useState<Promise<MediaItem[]> | null>(null);

  useEffect(() => {
    if (token) {
      setWatchlistPromise(getWatchlist(token));
    }
  }, [token]);

  return (
    <FilteredCollectionPageLayout
      title={t('watchlist.title')}
      filter={filter}
      onFilterChange={setFilter}
      loadingLabel={t('watchlist.loading')}
    >
      {watchlistPromise && (
        <WatchlistContent watchlistPromise={watchlistPromise} filter={filter} token={token} />
      )}
    </FilteredCollectionPageLayout>
  );
}

export default WatchlistPage;
