/**
 * Home page component with media generator.
 * Main page where users generate random media based on filters.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { FilterProvider, useMediaResults } from '../features/media/context/FilterContext.jsx';
import FilterPanel from '../features/media/components/filters/FilterPanel.jsx';
import SessionControls from '../features/media/components/SessionControls.jsx';
import MediaCard from '../features/media/components/MediaCard.jsx';
import HomeHeader from './home/HomeHeader.jsx';
import HomeHero from './home/HomeHero.jsx';
import GenerateButton from './home/GenerateButton.jsx';
import MobileFiltersToggle from './home/MobileFiltersToggle.jsx';

function HomePageContent() {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { user, logout } = useAuth();
  const {
    mediaType,
    randomMedia,
    isLoading,
    error,
    generateRandomMedia,
    viewedMedia,
    exportViewedMedia,
    importViewedMedia,
  } = useMediaResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 pb-24 md:p-8 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <HomeHeader user={user} onLogout={logout} />

        <HomeHero mediaType={mediaType} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-1 lg:order-2">
            <MobileFiltersToggle filtersOpen={filtersOpen} onToggle={setFiltersOpen} />

            <GenerateButton
              variant="desktop"
              isLoading={isLoading}
              onGenerate={generateRandomMedia}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-xl border border-red-700/50 backdrop-blur-sm flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
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
                  <div className="font-bold mb-1">{t('common.error')}</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {randomMedia && !isLoading && <MediaCard media={randomMedia} mediaType={mediaType} />}

            <SessionControls
              viewedMedia={viewedMedia}
              exportViewedMedia={exportViewedMedia}
              importViewedMedia={importViewedMedia}
            />
          </div>

          <div
            className={
              'lg:col-span-1 space-y-6 order-2 lg:order-1 ' +
              (filtersOpen ? 'block ' : 'hidden ') +
              'lg:block'
            }
          >
            <FilterPanel />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-brand-accent/30 px-4 py-3 flex items-center justify-between lg:hidden backdrop-blur-md">
        <span className="text-sm text-gray-300">
          {t('home.generateMobile', {
            type: mediaType ? t('home.movieMobile') : t('home.tvMobile'),
          })}
        </span>
        <GenerateButton variant="mobile" isLoading={isLoading} onGenerate={generateRandomMedia} />
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <FilterProvider>
      <HomePageContent />
    </FilterProvider>
  );
}

export default HomePage;
