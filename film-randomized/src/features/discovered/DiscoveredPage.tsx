/**
 * Page listing titles discovered via random generation (excluded until removed).
 */
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getDiscovered } from '../../shared/services/discoveredApi.js';
import FilteredCollectionPageLayout from '../../shared/components/FilteredCollectionPageLayout.jsx';
import DiscoveredContent from './components/DiscoveredContent.jsx';
import { useCollectionPageData } from '../../shared/hooks/useCollectionPageData.js';

function DiscoveredPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { filter, setFilter, itemsPromise } = useCollectionPageData({
    token,
    fetchCollection: getDiscovered,
  });

  return (
    <FilteredCollectionPageLayout
      title={t('discovered.title')}
      filter={filter}
      onFilterChange={setFilter}
      loadingLabel={t('discovered.loading')}
    >
      {itemsPromise && (
        <DiscoveredContent discoveredPromise={itemsPromise} filter={filter} token={token} />
      )}
    </FilteredCollectionPageLayout>
  );
}

export default DiscoveredPage;
