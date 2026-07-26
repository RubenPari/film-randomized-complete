import { useTranslation } from 'react-i18next';
import AppIcon from '../../../../shared/components/AppIcon.jsx';
import type { Genre } from '../../../../shared/types/index.js';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: number[];
  handleGenreToggle: (genreId: number) => void;
  isLoading: boolean;
  error: string | null;
}

function GenreFilter({
  genres,
  selectedGenres,
  handleGenreToggle,
  isLoading,
  error,
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
              className="h-11 animate-pulse border-2 border-film-ink/20 bg-film-ink/10"
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      {!isLoading && error && (
        <p className="border-2 border-danger bg-white p-3 text-sm text-danger" role="alert">
          {t('filters.genreError')}
        </p>
      )}
      {!isLoading && !error && (
        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <label
                key={genre.id}
                className={`relative flex min-h-11 cursor-pointer items-center gap-3 border-2 border-film-ink px-3 py-2 text-sm font-semibold ${
                  isSelected ? 'bg-film-blue text-white' : 'bg-white hover:bg-film-yellow'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="peer sr-only"
                />
                <span className="flex size-5 items-center justify-center border-2 border-current bg-white text-film-blue peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-film-blue">
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
