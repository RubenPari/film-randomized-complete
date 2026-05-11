/**
 * Vote count filter component.
 * Allows users to filter media by minimum number of votes.
 */
import { useTranslation } from 'react-i18next';
import { VOTE_COUNT_THRESHOLDS } from '../../../../shared/constants/config.js';

interface VoteCountFilterProps {
  minVoteCount: number;
  setMinVoteCount: (val: number) => void;
}

/**
 * Component for filtering media by minimum vote count.
 * Provides preset ranges for common vote count thresholds.
 */
function VoteCountFilter({ minVoteCount, setMinVoteCount }: VoteCountFilterProps) {
  const { t } = useTranslation();

  const voteCountLabels: Record<number, string> = {
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
