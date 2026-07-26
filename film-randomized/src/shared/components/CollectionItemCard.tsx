import { useTranslation } from 'react-i18next';
import AppIcon from './AppIcon.jsx';
import { IMAGE_BASE_URL } from '../constants/api.js';
import type { MediaItem } from '../types/index.js';

interface CollectionItemCardProps {
  item: MediaItem;
  onRemove?: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
}

function CollectionItemCard({ item, onRemove }: CollectionItemCardProps) {
  const { t } = useTranslation();
  const genres = parseGenres(item.genres);
  const tmdbId = item.tmdb_id;
  const isTv = item.media_type === 'tv';
  const year = item.release_date ? new Date(item.release_date).getFullYear() : null;

  return (
    <article className="flex h-full flex-col overflow-hidden border-2 border-film-ink bg-white">
      <div className="relative">
        <a
          href={`https://www.themoviedb.org/${isTv ? 'tv' : 'movie'}/${tmdbId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-[2/3] overflow-hidden bg-film-ink"
          title={t('media.onTmdb', { title: item.title })}
        >
          {item.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={item.title}
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
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(tmdbId, isTv ? 'tv' : 'movie')}
            className="ui-icon-button absolute left-2 top-2 border-white bg-danger text-white hover:bg-danger sm:left-3 sm:top-3"
            aria-label={`${t('media.remove')}: ${item.title}`}
          >
            <AppIcon name="trash" size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-film-blue">
          {isTv ? t('home.tvShow') : t('home.movie')}
        </p>
        <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 sm:text-base">
          {item.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {year && <span className="ui-chip min-h-7 px-2 py-0.5">{year}</span>}
          {item.vote_average != null && (
            <span className="ui-chip min-h-7 bg-film-yellow px-2 py-0.5">
              <AppIcon name="star" size={12} className="fill-film-ink" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="truncate border border-film-ink px-2 py-1 text-[0.65rem] font-semibold"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function parseGenres(raw: unknown): { id: number; name: string }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as { id: number; name: string }[];
  try {
    const parsed = JSON.parse(raw as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default CollectionItemCard;
