import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import type { MediaFeedbackReason, MediaFeedbackValue } from '../../../shared/types/index.js';

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
  const [showDislikeReasons, setShowDislikeReasons] = useState(currentValue === 'dislike');

  return (
    <section className="mt-5 border-t-2 border-film-ink pt-5">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-wider">
        {t('recommendation.feedbackPrompt')}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setShowDislikeReasons(false);
            onFeedback('like');
          }}
          aria-pressed={currentValue === 'like'}
          className={`ui-button ${currentValue === 'like' ? 'bg-success text-white' : 'ui-button--quiet'}`}
        >
          <AppIcon name="thumbUp" />
          {t('recommendation.like')}
        </button>
        <button
          type="button"
          onClick={() => setShowDislikeReasons(true)}
          aria-pressed={currentValue === 'dislike'}
          className={`ui-button ${currentValue === 'dislike' ? 'bg-film-coral text-film-ink' : 'ui-button--quiet'}`}
        >
          <AppIcon name="thumbDown" />
          {t('recommendation.dislike')}
        </button>
      </div>
      {showDislikeReasons && (
        <div className="mt-3 border-l-4 border-film-coral pl-3">
          <p className="mb-2 text-sm font-semibold">{t('recommendation.reasonPrompt')}</p>
          <div className="flex flex-wrap gap-2">
            {DISLIKE_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => onFeedback('dislike', reason)}
                className="ui-chip hover:bg-film-coral"
              >
                {t(`recommendation.reason.${reason}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default RecommendationFeedbackButtons;
