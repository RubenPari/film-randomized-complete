import {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
} from 'react';
import { getMediaItemKey, normalizeMediaItem } from '../utils/normalizeMediaItem.js';
import { logger } from '../utils/logger.js';
import type { MediaType } from '../types/index.js';
import type { NormalizableItem } from '../utils/normalizeMediaItem.js';

interface UseCollectionItemsStateOptions {
  initialItems: unknown;
  token: string | null;
  onRemove: (item: NormalizableItem, token: string) => Promise<void>;
}

interface UseCollectionItemsStateReturn {
  items: NormalizableItem[];
  handleRemove: (tmdbId: number, mediaType: MediaType) => Promise<void>;
}

function normalizeItems(items: unknown): NormalizableItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(normalizeMediaItem)
    .filter((item): item is NormalizableItem => !!item);
}

export function useCollectionItemsState({
  initialItems,
  token,
  onRemove,
}: UseCollectionItemsStateOptions): UseCollectionItemsStateReturn {
  const [items, setItems] = useState<NormalizableItem[]>(() => normalizeItems(initialItems));

  useEffect(() => {
    setItems(normalizeItems(initialItems));
  }, [initialItems]);

  const itemsRef = useRef<NormalizableItem[]>(items);
  itemsRef.current = items;

  const handleRemove = useCallback(
    async (tmdbId: number, mediaType: MediaType) => {
      if (!token) return;

      const target: NormalizableItem = { tmdb_id: tmdbId, media_type: mediaType };
      const targetKey = getMediaItemKey(target);
      const snapshot = itemsRef.current;

      startTransition(() => {
        setItems((prev) => prev.filter((item) => getMediaItemKey(item) !== targetKey));
      });

      try {
        const original = snapshot.find((item) => getMediaItemKey(item) === targetKey);
        await onRemove(original ?? target, token);
      } catch (err: unknown) {
        startTransition(() => {
          setItems(snapshot);
        });
        logger.error('CollectionContent.remove', err);
      }
    },
    [token, onRemove],
  );

  return {
    items,
    handleRemove,
  };
}
