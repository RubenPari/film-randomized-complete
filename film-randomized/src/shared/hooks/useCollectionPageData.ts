import { useEffect, useState } from 'react';

type CollectionFilter = 'all' | 'movies' | 'tv';

interface UseCollectionPageDataOptions<T> {
  token: string | null;
  fetchCollection: (token: string) => Promise<T[]>;
}

interface UseCollectionPageDataReturn<T> {
  filter: CollectionFilter;
  setFilter: (filter: CollectionFilter) => void;
  itemsPromise: Promise<T[]> | null;
}

/**
 * Shared state wiring for pages that render a filtered collection list.
 */
export function useCollectionPageData<T>({
  token,
  fetchCollection,
}: UseCollectionPageDataOptions<T>): UseCollectionPageDataReturn<T> {
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [itemsPromise, setItemsPromise] = useState<Promise<T[]> | null>(null);

  useEffect(() => {
    if (token) {
      setItemsPromise(fetchCollection(token));
      return;
    }
    setItemsPromise(null);
  }, [fetchCollection, token]);

  return { filter, setFilter, itemsPromise };
}
