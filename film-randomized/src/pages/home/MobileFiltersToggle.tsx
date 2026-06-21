/**
 * Toggle visibility of the filter column on small screens.
 */
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  filtersOpen: boolean;
  onToggle: (open: boolean) => void;
}

function MobileFiltersToggle({ filtersOpen, onToggle }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="mb-4 lg:hidden">
      <button
        type="button"
        onClick={() => onToggle(!filtersOpen)}
        className="btn-secondary w-full"
        aria-expanded={filtersOpen}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.879a1 1 0 00-.293-.707L3.293 7A1 1 0 013 6.293V4z"
          />
        </svg>
        {filtersOpen ? t('home.hideFilters') : t('home.showFilters')}
      </button>
    </div>
  );
}

export default MobileFiltersToggle;
