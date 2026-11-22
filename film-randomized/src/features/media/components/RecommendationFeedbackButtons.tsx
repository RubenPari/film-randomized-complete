import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import type { MediaFeedbackReason, MediaFeedbackValue } from '../../../shared/types/index.js';

interface RecommendationFeedbackButtonsProps {
  currentValue: MediaFeedbackValue | null;
  onFeedback: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
  onSeen?: () => void;
  isSeen?: boolean;
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
  onSeen,
  isSeen = false,
}: RecommendationFeedbackButtonsProps) {
  const { t } = useTranslation();
  const [showDislikeReasons, setShowDislikeReasons] = useState(currentValue === 'dislike');

  return (
    <section className="mt-5 border-t border-line pt-5">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-wider">
        {t('recommendation.feedbackPrompt')}
      </h3>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setShowDislikeReasons(false);
            onFeedback('like');
          }}
          aria-pressed={currentValue === 'like'}
          className={`ui-button ${currentValue === 'like' ? 'bg-success text-on-accent' : 'ui-button--quiet'}`}
        >
          <AppIcon name="thumbUp" />
          {t('recommendation.like')}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowDislikeReasons(true);
            onFeedback('dislike');
          }}
          aria-pressed={currentValue === 'dislike'}
          className={`ui-button ${currentValue === 'dislike' ? 'bg-film-coral text-on-accent' : 'ui-button--quiet'}`}
        >
          <AppIcon name="thumbDown" />
          {t('recommendation.dislike')}
        </button>
      </div>
      {onSeen && (
        <>
          <button
            type="button"
            onClick={onSeen}
            disabled={isSeen}
            aria-pressed={isSeen}
            className="ui-button ui-button--secondary mt-2 w-full"
          >
            <AppIcon name="check" />
            {isSeen ? t('recommendation.seenDone') : t('recommendation.seen')}
          </button>
          <p className="mt-2 text-xs text-fg/70">{t('recommendation.seenHint')}</p>
        </>
      )}
      {showDislikeReasons && (
        <div className="mt-3 border-l-4 border-film-coral pl-3">
          <p className="mb-2 text-sm font-semibold">{t('recommendation.reasonPrompt')}</p>
          <div className="flex flex-wrap gap-2">
            {DISLIKE_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => onFeedback('dislike', reason)}
                className="ui-chip hover:bg-film-coral hover:text-on-accent"
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
