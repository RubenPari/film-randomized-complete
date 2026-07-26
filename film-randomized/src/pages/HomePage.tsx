import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilterContext, useMediaResults } from '../features/media/context/FilterContext.jsx';
import FilterDrawer from '../features/media/components/filters/FilterDrawer.jsx';
import MediaTypeSelector from '../features/media/components/filters/MediaTypeSelector.jsx';
import MediaCard from '../features/media/components/MediaCard.jsx';
import AppIcon from '../shared/components/AppIcon.jsx';
import HomeHero from './home/HomeHero.jsx';
import ActiveFilterSummary from './home/ActiveFilterSummary.jsx';
import GenerateButton from './home/GenerateButton.jsx';

function HomePage(): JSX.Element {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { mediaType, setMediaType } = useFilterContext();
  const {
    generatedMediaType,
    randomMedia,
    recommendationExplanationKeys,
    currentMediaFeedbackValue,
    isGenerating,
    error,
    generateRandomMedia,
    submitMediaFeedback,
  } = useMediaResults();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-7 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <HomeHero mediaType={mediaType} />

      <section className="ui-panel grid gap-5 p-4 lg:grid-cols-[15rem_1fr_auto] lg:items-end">
        <MediaTypeSelector mediaType={mediaType} setMediaType={setMediaType} />
        <ActiveFilterSummary />
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="ui-button ui-button--secondary"
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
        >
          <AppIcon name="filter" />
          {t('filters.open')}
        </button>
      </section>

      <section
        aria-label={t('home.resultStage')}
        className="flex min-h-[24rem] flex-1 items-stretch"
      >
        {isGenerating ? (
          <div
            className="ui-panel grid min-h-[28rem] w-full animate-pulse overflow-hidden md:grid-cols-5"
            aria-busy="true"
            role="status"
          >
            <span className="sr-only">{t('home.generating')}</span>
            <div className="min-h-72 bg-film-ink/15 md:col-span-2" aria-hidden="true" />
            <div className="space-y-5 p-7 md:col-span-3" aria-hidden="true">
              <div className="h-12 w-4/5 bg-film-ink/15" />
              <div className="h-7 w-2/5 bg-film-ink/15" />
              <div className="h-24 w-full bg-film-ink/10" />
              <div className="h-11 w-1/2 bg-film-ink/15" />
            </div>
          </div>
        ) : randomMedia && generatedMediaType ? (
          <div key={`${generatedMediaType}-${randomMedia.id}`} className="film-frame-enter w-full">
            <MediaCard
              media={randomMedia}
              mediaType={generatedMediaType}
              recommendationExplanationKeys={recommendationExplanationKeys}
              currentMediaFeedbackValue={currentMediaFeedbackValue}
              onFeedback={submitMediaFeedback}
            />
          </div>
        ) : (
          <div className="ui-panel flex min-h-[28rem] w-full flex-col items-center justify-center p-8 text-center">
            <AppIcon name="brand" size={88} />
            <h2 className="mt-6 font-display text-4xl font-bold uppercase">
              {t('home.emptyTitle')}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-film-ink/65">
              {t('home.emptyDescription')}
            </p>
          </div>
        )}
      </section>

      <section className="bottom-safe-tabs sticky z-20 -mx-4 border-y-2 border-film-ink bg-film-screen px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:flex lg:items-start lg:justify-between lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0">
        {error && (
          <div
            className="mb-3 flex items-start gap-3 border-2 border-danger bg-white p-3 text-sm text-danger lg:mb-0 lg:max-w-2xl"
            role="alert"
          >
            <AppIcon name="alert" className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">{t('common.error')}</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        <GenerateButton
          isLoading={isGenerating}
          onGenerate={generateRandomMedia}
          className="ml-auto"
        />
      </section>

      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}

export default HomePage;
