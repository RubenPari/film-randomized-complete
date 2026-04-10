/**
 * Vote count filter component.
 * Allows users to filter media by minimum number of votes.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VOTE_COUNT_THRESHOLDS } from '../../../../shared/constants/config.js';

/**
 * Component for filtering media by minimum vote count.
 * Provides preset ranges for common vote count thresholds.
 *
 * @param {Object} props - Component props
 * @param {number} props.minVoteCount - Minimum vote count value
 * @param {Function} props.setMinVoteCount - Function to update minimum vote count
 * @returns {JSX.Element} Vote count filter component
 */
function VoteCountFilter({ minVoteCount, setMinVoteCount }) {
  const { t } = useTranslation();

  const voteCountLabels = {
    1000: '1,000+',
    10000: '10,000+',
    50000: '50,000+',
    75000: '75,000+',
  };

  const voteCountRanges = VOTE_COUNT_THRESHOLDS.map((value) => ({
    value,
    label: value === 0 ? t('common.all') : voteCountLabels[value],
  }));

  return (
    <div>
      <label className="filter-label">{t('filters.voteCount')}</label>
      <div className="flex flex-wrap gap-2">
        {voteCountRanges.map(function (range) {
          return (
            <button
              key={range.value}
              onClick={function () {
                setMinVoteCount(range.value);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                minVoteCount === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VoteCountFilter;
