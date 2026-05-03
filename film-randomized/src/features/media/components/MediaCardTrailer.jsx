import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Embedded YouTube trailer block. Returns `null` when there's no key so
 * the parent can render unconditionally.
 *
 * @param {Object} props
 * @param {string|null|undefined} props.trailerKey
 */
function MediaCardTrailer({ trailerKey }) {
  const { t } = useTranslation();

  if (!trailerKey) return null;

  return (
    <div className="p-6 pt-0 mt-4 md:mt-0 md:px-6 md:pb-6">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        {t('common.trailer')}
      </h3>
      <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title={t('common.trailer')}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

export default MediaCardTrailer;
