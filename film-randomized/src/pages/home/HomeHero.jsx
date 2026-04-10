/**
 * Home title and description.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @param {Object} props
 * @param {boolean} props.mediaType
 */
function HomeHero({ mediaType }) {
  const { t } = useTranslation();

  return (
    <header className="text-center mb-10 py-8">
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-brand-highlight to-brand-deep bg-clip-text text-transparent mb-4 drop-shadow-lg">
        {t('home.title', { type: mediaType ? t('home.movie') : t('home.tvShow') })}
      </h1>
      <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">{t('home.description')}</p>
    </header>
  );
}

export default HomeHero;
