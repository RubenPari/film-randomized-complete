import { useState, useEffect } from 'react';
import { fetchGenres } from '../../../shared/services/tmdbApi.js';
import { logger } from '../../../shared/utils/logger.js';
import type { Genre } from '../../../shared/types/index.js';

export interface UseGenresReturn {
  genres: Genre[];
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

/**
 * Loads genres for filter UI. Caching lives only in tmdbApi.fetchGenres (module-level).
 */
export function useGenres(): UseGenresReturn {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadGenres = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await fetchGenres();
        if (isMounted) {
          setGenres(data as Genre[]);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch genres. Please try again later.');
          logger.error('useGenres.load', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadGenres();

    return () => {
      isMounted = false;
    };
  }, [attempt]);

  return { genres, error, isLoading, reload: () => setAttempt((n) => n + 1) };
}
