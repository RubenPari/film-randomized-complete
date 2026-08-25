import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import SaveButtons from '../../media/components/SaveButtons.jsx';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';
import type { MediaType, TmdbMedia } from '../../../shared/types/index.js';

interface SearchResultCardProps {
  media: TmdbMedia;
  mediaType: MediaType;
}

function SearchResultCard({ media, mediaType }: SearchResultCardProps) {
  const { t } = useTranslation();
  const isTv = mediaType === 'tv';
  const title = media.title || media.name || '';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <article className="flex h-full flex-col overflow-hidden border-2 border-film-ink bg-white">
      <a
        href={`https://www.themoviedb.org/${isTv ? 'tv' : 'movie'}/${media.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-[2/3] overflow-hidden bg-film-ink"
        title={t('media.onTmdb', { title })}
      >
        {media.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${media.poster_path}`}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-3 bg-film-blue p-4 text-center text-white">
            <AppIcon name="brand" size={48} />
            <span className="font-mono text-[0.65rem] font-semibold uppercase">
              {t('common.noImage')}
            </span>
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-film-blue">
          {isTv ? t('home.tvShow') : t('home.movie')}
        </p>
        <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 sm:text-base">
          {title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {year && <span className="ui-chip min-h-7 px-2 py-0.5">{year}</span>}
          {media.vote_average != null && media.vote_average > 0 && (
            <span className="ui-chip min-h-7 bg-film-yellow px-2 py-0.5">
              <AppIcon name="star" size={12} className="fill-film-ink" />
              {media.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <SaveButtons media={media} mediaType={mediaType} />
        </div>
      </div>
    </article>
  );
}

export default SearchResultCard;
