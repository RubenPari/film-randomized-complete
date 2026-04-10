/**
 * Rating filter component.
 * Allows users to filter media by minimum and maximum rating.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component for filtering media by rating range (min and max).
 *
 * @param {Object} props - Component props
 * @param {number} props.minRating - Minimum rating value (0-10)
 * @param {number} props.maxRating - Maximum rating value (0-10)
 * @param {Function} props.setMinRating - Function to update minimum rating
 * @param {Function} props.setMaxRating - Function to update maximum rating
 * @returns {JSX.Element} Rating filter component
 */
function RatingFilter({ minRating, maxRating, setMinRating, setMaxRating }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h2 className="filter-title mb-0">{t('filters.rating')}</h2>
      </div>
      <div className="mb-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-lg">
          <span>{minRating.toFixed(1)}</span>
          <span className="text-gray-500">-</span>
          <span>{maxRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span className="font-medium">{t('filters.from')}</span>
            <span className="font-bold text-cyan-400">{minRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">0</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minRating}
              onChange={function (e) {
                setMinRating(parseFloat(e.target.value));
              }}
              className="rating-slider"
            />
            <span className="text-xs text-gray-500 font-medium">10</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span className="font-medium">{t('filters.to')}</span>
            <span className="font-bold text-cyan-400">{maxRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">0</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={maxRating}
              onChange={function (e) {
                setMaxRating(parseFloat(e.target.value));
              }}
              className="rating-slider"
            />
            <span className="text-xs text-gray-500 font-medium">10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingFilter;
