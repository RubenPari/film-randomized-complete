/**
 * Watchlist page component.
 * Displays and manages the user's watchlist with filtering capabilities.
 */
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getWatchlist } from '../../shared/services/watchlistApi.js';
import FilteredCollectionPageLayout from '../../shared/components/FilteredCollectionPageLayout.jsx';
import WatchlistContent from './components/WatchlistContent.jsx';
import { useCollectionPageData } from '../../shared/hooks/useCollectionPageData.js';

function WatchlistPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { filter, setFilter, itemsPromise } = useCollectionPageData({
    token,
    fetchCollection: getWatchlist,
  });

  return (
    <FilteredCollectionPageLayout
      title={t('watchlist.title')}
      filter={filter}
      onFilterChange={setFilter}
      loadingLabel={t('watchlist.loading')}
    >
      {itemsPromise && (
        <WatchlistContent
          watchlistPromise={itemsPromise}
          filter={filter}
          token={token}
          onClearFilter={() => setFilter('all')}
        />
      )}
    </FilteredCollectionPageLayout>
  );
}

export default WatchlistPage;
