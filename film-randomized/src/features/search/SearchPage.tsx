/**
 * Search page: look up a movie or TV show by title and add it straight to the watchlist.
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../shared/components/AppIcon.jsx';
import { searchMedia } from '../../shared/services/tmdbApi.js';
import { logger } from '../../shared/utils/logger.js';
import SearchResultCard from './components/SearchResultCard.jsx';
import type { TmdbMedia } from '../../shared/types/index.js';

const SEARCH_DEBOUNCE_MS = 300;

function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<TmdbMedia[]>([]);
  const [tvShows, setTvShows] = useState<TmdbMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setMovies([]);
      setTvShows([]);
      setError(null);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const timeoutId = window.setTimeout(() => {
      searchMedia(trimmedQuery)
        .then((result) => {
          if (isCancelled) return;
          setMovies(result.movies);
          setTvShows(result.tvShows);
          setHasSearched(true);
        })
        .catch((searchError: unknown) => {
          if (isCancelled) return;
          setError(t('search.error'));
          logger.error('SearchPage.search', searchError);
        })
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query, t]);

  const hasResults = movies.length > 0 || tvShows.length > 0;

  return (
    <section className="mx-auto min-h-full w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <header className="mb-7">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-film-blue">
          {t('search.eyebrow')}
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">
          {t('search.title')}
        </h1>
      </header>

      <div className="relative mb-8 max-w-xl">
        <AppIcon
          name="search"
          size={20}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-film-ink/50"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          className="ui-field pl-10"
        />
      </div>

      {isLoading && (
        <div className="ui-panel flex min-h-52 items-center justify-center gap-3 p-8" role="status">
          <span className="ui-spinner text-film-blue" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            {t('search.loading')}
          </span>
        </div>
      )}

      {!isLoading && error && (
        <p
          className="border-2 border-danger bg-white p-4 text-sm font-semibold text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      {!isLoading && !error && !hasSearched && (
        <p className="font-mono text-sm text-film-ink/60">{t('search.emptyIdle')}</p>
      )}

      {!isLoading && !error && hasSearched && !hasResults && (
        <p className="font-mono text-sm text-film-ink/60">{t('search.noResults')}</p>
      )}

      {!isLoading && !error && hasResults && (
        <div className="flex flex-col gap-8">
          {movies.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-bold uppercase">{t('search.moviesSection')}</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {movies.map((media) => (
                  <SearchResultCard key={`movie-${media.id}`} media={media} mediaType="movie" />
                ))}
              </div>
            </div>
          )}

          {tvShows.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-bold uppercase">{t('search.tvSection')}</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {tvShows.map((media) => (
                  <SearchResultCard key={`tv-${media.id}`} media={media} mediaType="tv" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default SearchPage;
