import { useState, useEffect } from 'react';
import { fetchGenres } from '../../../shared/services/tmdbApi.js';
import type { Genre } from '../../../shared/types/index.js';

export interface UseGenresReturn {
  genres: Genre[];
  error: string | null;
}

/**
 * Loads genres for filter UI. Caching lives only in tmdbApi.fetchGenres (module-level).
 */
export function useGenres(): UseGenresReturn {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        if (isMounted) {
          setGenres(data as Genre[]);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch genres. Please try again later.');
          console.error(err);
        }
      }
    };

    loadGenres();

    return () => {
      isMounted = false;
    };
  }, []);

  return { genres, error };
}
