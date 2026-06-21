/**
 * Home hero: eyebrow label, large display title, and description.
 */
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { MediaType } from '../../shared/types/index.js';

interface Props {
  mediaType: MediaType;
}

function HomeHero({ mediaType }: Props): JSX.Element {
  const { t } = useTranslation();
  const typeLabel = mediaType === 'movie' ? t('home.movie') : t('home.tvShow');

  return (
    <header className="mb-10 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        {t('home.eyebrow')}
      </span>
      <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-extrabold leading-tight text-cream md:text-6xl">
        {t('home.title', { type: typeLabel })}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">
        {t('home.description')}
      </p>
    </header>
  );
}

export default HomeHero;
