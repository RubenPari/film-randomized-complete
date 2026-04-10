/**
 * Year filter component.
 * Allows users to filter media by release year range.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MIN_RELEASE_YEAR } from '../../../../shared/constants/config.js';

/**
 * Component for filtering media by release year range.
 *
 * @param {Object} props - Component props
 * @param {number} props.releaseYearFrom - Start year for filtering (1900-current year)
 * @param {number} props.releaseYearTo - End year for filtering (1900-current year)
 * @param {Function} props.setReleaseYearFrom - Function to update start year
 * @param {Function} props.setReleaseYearTo - Function to update end year
 * @returns {JSX.Element} Year filter component
 */
function YearFilter({ releaseYearFrom, releaseYearTo, setReleaseYearFrom, setReleaseYearTo }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <h2 className="filter-title">{t('filters.year')}</h2>
      <p className="text-sm text-gray-400 mb-3">{t('filters.yearDescription')}</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-300">{t('filters.from')}</label>
          <input
            type="number"
            min={MIN_RELEASE_YEAR}
            max={currentYear}
            value={releaseYearFrom}
            onChange={function (e) {
              setReleaseYearFrom(parseInt(e.target.value));
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">{t('filters.to')}</label>
          <input
            type="number"
            min={MIN_RELEASE_YEAR}
            max={currentYear}
            value={releaseYearTo}
            onChange={function (e) {
              setReleaseYearTo(parseInt(e.target.value));
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-400">
        <span>1900</span>
        <span>
          {releaseYearFrom} - {releaseYearTo}
        </span>
        <span>{currentYear}</span>
      </div>
    </div>
  );
}

export default YearFilter;
