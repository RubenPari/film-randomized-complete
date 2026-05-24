import { useTranslation } from 'react-i18next';
import type {
  MediaFeedbackReason,
  MediaFeedbackValue,
} from '../../../shared/types/index.js';

interface RecommendationFeedbackButtonsProps {
  currentValue: MediaFeedbackValue | null;
  onFeedback: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
}

const DISLIKE_REASONS: MediaFeedbackReason[] = [
  'not_in_mood',
  'wrong_genre',
  'already_seen',
  'too_long',
  'too_slow',
];

function RecommendationFeedbackButtons({
  currentValue,
  onFeedback,
}: RecommendationFeedbackButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
        {t('recommendation.feedbackPrompt')}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onFeedback('like')}
          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
            currentValue === 'like'
              ? 'bg-green-600/20 text-green-300 border-green-500/60'
              : 'bg-slate-800/60 text-slate-300 border-slate-600/60 hover:border-green-500/50'
          }`}
        >
          👍 {t('recommendation.like')}
        </button>
        {DISLIKE_REASONS.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onFeedback('dislike', reason)}
            className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
              currentValue === 'dislike'
                ? 'bg-red-600/20 text-red-300 border-red-500/60'
                : 'bg-slate-800/60 text-slate-300 border-slate-600/60 hover:border-red-500/50'
            }`}
          >
            👎 {t(`recommendation.reason.${reason}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecommendationFeedbackButtons;
