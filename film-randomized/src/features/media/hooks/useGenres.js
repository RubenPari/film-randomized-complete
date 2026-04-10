import { useState, useEffect } from 'react';
import { fetchGenres } from '../../../shared/services/tmdbApi.js';

/**
 * Loads genres for filter UI. Caching lives only in tmdbApi.fetchGenres (module-level).
 */
export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        if (isMounted) {
          setGenres(data);
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
