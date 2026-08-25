import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppIcon from '../shared/components/AppIcon.jsx';
import {
  fetchMediaDetails,
  fetchSimilarMedia,
} from '../shared/services/tmdbApi.js';
import { logger } from '../shared/utils/logger.js';
import SearchResultCard from '../features/search/components/SearchResultCard.jsx';
import type {
  MediaType,
  TmdbMedia,
} from '../shared/types/index.js';

function SimilarPage() {
  const { t } = useTranslation();
  const { mediaType, mediaId } = useParams<{ mediaType: string; mediaId: string }>();

  const [sourceMedia, setSourceMedia] = useState<TmdbMedia | null>(null);
  const [similarItems, setSimilarItems] = useState<TmdbMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isValidMediaType = (value?: string): value is MediaType =>
    value === 'movie' || value === 'tv';

  useEffect(() => {
    const numericId = Number(mediaId);

    if (!isValidMediaType(mediaType) || Number.isNaN(numericId)) {
      setError('Invalid media type or ID');
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetchMediaDetails(mediaType, numericId),
      fetchSimilarMedia(mediaType, numericId),
    ])
      .then(([details, similar]) => {
        if (isCancelled) return;
        setSourceMedia(details);
        setSimilarItems(similar);
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        setError(t('similar.error'));
        logger.error('SimilarPage', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [mediaType, mediaId, t]);

  const sourceTitle = sourceMedia?.title || sourceMedia?.name || '';
  const sourceYear = sourceMedia?.release_date || sourceMedia?.first_air_date
    ? new Date((sourceMedia.release_date || sourceMedia.first_air_date)!).getFullYear()
    : null;

  return (
    <div className="mx-auto min-h-full w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <Link
        to="/"
        className="ui-button ui-button--quiet mb-6 inline-flex items-center"
      >
        <AppIcon name="arrowLeft" size={20} />
        {t('common.home')}
      </Link>

      <header className="mb-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-film-blue">
          {t('similar.eyebrow')}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
          {t('similar.title', { title: sourceTitle })}
        </h1>
        {!isLoading && sourceMedia && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {sourceYear && <span className="ui-chip">{sourceYear}</span>}
            {sourceMedia.vote_average != null && sourceMedia.vote_average > 0 && (
              <span className="ui-chip bg-film-yellow">
                <AppIcon name="star" size={14} className="fill-film-ink" />
                {sourceMedia.vote_average.toFixed(1)}/10
              </span>
            )}
            {sourceMedia.genres?.slice(0, 3).map((genre) => (
              <span key={genre.id} className="ui-chip">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {isLoading && (
        <div className="ui-panel flex min-h-52 items-center justify-center gap-3 p-8" role="status">
          <span className="ui-spinner text-film-blue" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            {t('similar.loading')}
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

      {!isLoading && !error && similarItems.length === 0 && sourceMedia && (
        <p className="font-mono text-sm text-film-ink/60">
          {t('similar.empty')}
        </p>
      )}

      {!isLoading && !error && similarItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {similarItems.map((media) => (
            <SearchResultCard
              key={media.id}
              media={media}
              mediaType={mediaType as MediaType}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SimilarPage;
