import { useTranslation } from 'react-i18next';
import { VOTE_COUNT_THRESHOLDS } from '../../../../shared/constants/config.js';

interface VoteCountFilterProps {
  minVoteCount: number;
  setMinVoteCount: (val: number) => void;
}

function VoteCountFilter({ minVoteCount, setMinVoteCount }: VoteCountFilterProps) {
  const { t } = useTranslation();
  const voteCountLabels: Record<number, string> = {
    1000: '1,000+',
    10000: '10,000+',
    50000: '50,000+',
    75000: '75,000+',
  };

  return (
    <fieldset>
      <legend className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider">
        {t('filters.voteCount')}
      </legend>
      <div className="flex flex-wrap gap-2">
        {VOTE_COUNT_THRESHOLDS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMinVoteCount(value)}
            aria-pressed={minVoteCount === value}
            className={`min-h-10 rounded-xl border border-line px-3 py-2 font-mono text-xs font-semibold ${
              minVoteCount === value
                ? 'bg-accent text-on-accent'
                : 'bg-surface text-fg hover:bg-surface-2'
            }`}
          >
            {value === 0 ? t('common.all') : voteCountLabels[value]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default VoteCountFilter;
