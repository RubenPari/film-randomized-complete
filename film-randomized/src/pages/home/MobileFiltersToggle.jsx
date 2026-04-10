/**
 * Toggle visibility of filter column on small screens.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @param {Object} props
 * @param {boolean} props.filtersOpen
 * @param {(open: boolean) => void} props.onToggle
 */
function MobileFiltersToggle({ filtersOpen, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mb-4 lg:hidden">
      <button
        type="button"
        onClick={function () {
          onToggle(!filtersOpen);
        }}
        className="inline-flex items-center px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
      >
        {filtersOpen ? t('home.hideFilters') : t('home.showFilters')}
      </button>
    </div>
  );
}

export default MobileFiltersToggle;
