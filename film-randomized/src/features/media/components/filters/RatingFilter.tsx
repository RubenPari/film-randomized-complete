import { useTranslation } from 'react-i18next';
import AppIcon from '../../../../shared/components/AppIcon.jsx';

interface RatingFilterProps {
  minRating: number;
  maxRating: number;
  setMinRating: (val: number) => void;
  setMaxRating: (val: number) => void;
}

function RatingFilter({ minRating, maxRating, setMinRating, setMaxRating }: RatingFilterProps) {
  const { t } = useTranslation();

  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
        <AppIcon name="star" className="fill-film-yellow" />
        {t('filters.rating')}
      </legend>
      <output className="mb-4 block border-2 border-film-ink bg-film-yellow px-3 py-2 text-center font-mono text-sm font-semibold">
        {minRating.toFixed(1)} — {maxRating.toFixed(1)}
      </output>
      <div className="space-y-5">
        <div>
          <label htmlFor="rating-min" className="mb-2 flex justify-between text-sm font-semibold">
            <span>{t('filters.from')}</span>
            <span className="font-mono" aria-hidden="true">
              {minRating.toFixed(1)}
            </span>
          </label>
          <input
            id="rating-min"
            type="range"
            min={0}
            max={maxRating}
            step={0.5}
            value={minRating}
            onChange={(event) =>
              setMinRating(Math.min(Number.parseFloat(event.target.value), maxRating))
            }
          />
        </div>
        <div>
          <label htmlFor="rating-max" className="mb-2 flex justify-between text-sm font-semibold">
            <span>{t('filters.to')}</span>
            <span className="font-mono" aria-hidden="true">
              {maxRating.toFixed(1)}
            </span>
          </label>
          <input
            id="rating-max"
            type="range"
            min={minRating}
            max={10}
            step={0.5}
            value={maxRating}
            onChange={(event) =>
              setMaxRating(Math.max(Number.parseFloat(event.target.value), minRating))
            }
          />
        </div>
      </div>
    </fieldset>
  );
}

export default RatingFilter;
