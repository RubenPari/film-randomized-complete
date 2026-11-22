import { useTranslation } from 'react-i18next';
import AppIcon from '../../../../shared/components/AppIcon.jsx';
import type { Genre } from '../../../../shared/types/index.js';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: number[];
  handleGenreToggle: (genreId: number) => void;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

function GenreFilter({
  genres,
  selectedGenres,
  handleGenreToggle,
  isLoading,
  error,
  onRetry,
}: GenreFilterProps) {
  const { t } = useTranslation();

  return (
    <fieldset>
      <legend className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider">
        {t('filters.genres')}
      </legend>
      {isLoading && (
        <div className="grid grid-cols-2 gap-2" role="status">
          <span className="sr-only">{t('filters.loadingGenres')}</span>
          {Array.from({ length: 8 }, (_, index) => (
            <span
              key={index}
              className="h-11 animate-pulse rounded-xl border border-line/20 bg-fg/10"
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      {!isLoading && error && (
        <div className="border border-danger bg-surface p-3 text-sm text-danger" role="alert">
          <p>{t('filters.genreError')}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="ui-button ui-button--secondary mt-3">
              {t('common.retry')}
            </button>
          )}
        </div>
      )}
      {!isLoading && !error && (
        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <label
                key={genre.id}
                className={`relative flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2 text-sm font-semibold ${
                  isSelected ? 'bg-accent text-on-accent' : 'bg-surface hover:bg-surface-2'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="peer sr-only"
                />
                <span className="flex size-5 items-center justify-center border border-current bg-surface text-accent peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-film-blue">
                  {isSelected && <AppIcon name="check" size={14} />}
                </span>
                <span>{genre.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

export default GenreFilter;
