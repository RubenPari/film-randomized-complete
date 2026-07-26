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
    <header className="max-w-3xl">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-film-blue">
        {t('home.eyebrow')}
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[0.9] sm:text-6xl">
        {t('home.title', { type: typeLabel })}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-film-ink/70">{t('home.description')}</p>
    </header>
  );
}

export default HomeHero;
