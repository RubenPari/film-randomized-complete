import { useTranslation } from 'react-i18next';
import { MIN_RELEASE_YEAR } from '../../../../shared/constants/config.js';

interface YearFilterProps {
  releaseYearFrom: number;
  releaseYearTo: number;
  setReleaseYearFrom: (val: number) => void;
  setReleaseYearTo: (val: number) => void;
}

function YearFilter({
  releaseYearFrom,
  releaseYearTo,
  setReleaseYearFrom,
  setReleaseYearTo,
}: YearFilterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <fieldset>
      <legend className="font-mono text-xs font-semibold uppercase tracking-wider">
        {t('filters.year')}
      </legend>
      <p className="mb-4 mt-2 text-sm text-film-ink/65">{t('filters.yearDescription')}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="release-year-from" className="mb-1 block text-sm font-semibold">
            {t('filters.from')}
          </label>
          <input
            id="release-year-from"
            type="number"
            min={MIN_RELEASE_YEAR}
            max={releaseYearTo}
            value={releaseYearFrom}
            onChange={(event) => {
              const next = Number.parseInt(event.target.value, 10);
              if (!Number.isNaN(next)) {
                setReleaseYearFrom(Math.min(Math.max(next, MIN_RELEASE_YEAR), releaseYearTo));
              }
            }}
            className="ui-field"
          />
        </div>
        <div>
          <label htmlFor="release-year-to" className="mb-1 block text-sm font-semibold">
            {t('filters.to')}
          </label>
          <input
            id="release-year-to"
            type="number"
            min={releaseYearFrom}
            max={currentYear}
            value={releaseYearTo}
            onChange={(event) => {
              const next = Number.parseInt(event.target.value, 10);
              if (!Number.isNaN(next)) {
                setReleaseYearTo(Math.max(Math.min(next, currentYear), releaseYearFrom));
              }
            }}
            className="ui-field"
          />
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-xs font-semibold">
        {releaseYearFrom} — {releaseYearTo}
      </p>
    </fieldset>
  );
}

export default YearFilter;
