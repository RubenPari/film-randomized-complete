import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary.jsx';

interface FilteredCollectionPageLayoutProps {
  title: string;
  filter: 'all' | 'movies' | 'tv';
  onFilterChange: (next: 'all' | 'movies' | 'tv') => void;
  loadingLabel: string;
  children: ReactNode;
}

function FilteredCollectionPageLayout({
  title,
  filter,
  onFilterChange,
  loadingLabel,
  children,
}: FilteredCollectionPageLayoutProps) {
  const { t } = useTranslation();
  const filters = [
    { value: 'all' as const, label: t('common.all') },
    { value: 'movies' as const, label: t('common.movies') },
    { value: 'tv' as const, label: t('common.tvShows') },
  ];

  return (
    <section className="mx-auto min-h-full w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <header className="mb-7">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-film-blue">
          {t('collections.eyebrow')}
        </p>
        <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-6xl">
            {title}
          </h1>
          <div
            className="flex max-w-full overflow-x-auto border-2 border-film-ink bg-white p-1"
            aria-label={t('collections.filterLabel')}
          >
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterChange(value)}
                aria-pressed={filter === value}
                className={`min-h-10 shrink-0 px-4 text-sm font-bold ${
                  filter === value ? 'bg-film-blue text-white' : 'hover:bg-film-yellow'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <ErrorBoundary>
        <Suspense
          fallback={
            <div
              className="ui-panel flex min-h-52 items-center justify-center gap-3 p-8"
              role="status"
            >
              <span className="ui-spinner text-film-blue" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                {loadingLabel}
              </span>
            </div>
          }
        >
          {children}
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

export default FilteredCollectionPageLayout;
