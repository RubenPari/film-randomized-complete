/**
 * Page listing titles discovered via random generation (excluded until removed).
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getDiscovered } from '../../shared/services/discoveredApi.js';
import FilteredCollectionPageLayout from '../../shared/components/FilteredCollectionPageLayout.jsx';
import DiscoveredContent from './components/DiscoveredContent.jsx';
import type { MediaItem } from '../../shared/types/index.js';

function DiscoveredPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [filter, setFilter] = useState<'all' | 'movies' | 'tv'>('all');
  const [discoveredPromise, setDiscoveredPromise] = useState<Promise<MediaItem[]> | null>(null);

  useEffect(() => {
    if (token) {
      setDiscoveredPromise(getDiscovered(token));
    }
  }, [token]);

  return (
    <FilteredCollectionPageLayout
      title={t('discovered.title')}
      filter={filter}
      onFilterChange={setFilter}
      loadingLabel={t('discovered.loading')}
    >
      {discoveredPromise && (
        <DiscoveredContent discoveredPromise={discoveredPromise} filter={filter} token={token} />
      )}
    </FilteredCollectionPageLayout>
  );
}

export default DiscoveredPage;
