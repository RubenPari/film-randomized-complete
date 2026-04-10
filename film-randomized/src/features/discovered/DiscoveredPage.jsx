/**
 * Page listing titles discovered via random generation (excluded until removed).
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getDiscovered } from '../../shared/services/discoveredApi.js';
import FilteredCollectionPageLayout from '../../shared/components/FilteredCollectionPageLayout.jsx';
import DiscoveredContent from './components/DiscoveredContent.jsx';

function DiscoveredPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [filter, setFilter] = useState('all');
  const [discoveredPromise, setDiscoveredPromise] = useState(null);

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
