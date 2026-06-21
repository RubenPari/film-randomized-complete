/**
 * Home page component with media generator.
 * Main page where users generate random media based on filters.
 */
import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaResults } from '../features/media/context/FilterContext.jsx';
import FilterPanel from '../features/media/components/filters/FilterPanel.jsx';
import MediaCard from '../features/media/components/MediaCard.jsx';
import HomeHero from './home/HomeHero.jsx';
import GenerateButton from './home/GenerateButton.jsx';
import MobileFiltersToggle from './home/MobileFiltersToggle.jsx';

function HomePage(): JSX.Element {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { mediaType, randomMedia, isGenerating, error, generateRandomMedia } = useMediaResults();

  const typeLabel = mediaType === 'movie' ? t('home.movie') : t('home.tvShow');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <HomeHero mediaType={mediaType} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Filters */}
        <aside className="order-2 lg:order-1 lg:col-span-1">
          <MobileFiltersToggle filtersOpen={filtersOpen} onToggle={setFiltersOpen} />
          <div className={(filtersOpen ? 'block ' : 'hidden ') + 'lg:block'}>
            <FilterPanel />
          </div>
        </aside>

        {/* Results */}
        <section className="order-1 lg:order-2 lg:col-span-2">
          <GenerateButton isLoading={isGenerating} onGenerate={generateRandomMedia} />

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
              <svg
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="mb-1 font-bold">{t('common.error')}</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}

          {randomMedia && !isGenerating ? (
            <MediaCard media={randomMedia} mediaType={mediaType} />
          ) : (
            !error && (
              <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-700 bg-ink-850/40 px-6 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800 text-gold">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-cream">
                  {t('home.emptyTitle')}
                </h2>
                <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
                  {t('home.emptyHint', { type: typeLabel.toLowerCase() })}
                </p>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
