import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import { OVERVIEW_MAX_LENGTH } from '../../../shared/constants/config.js';
import type {
  MediaCredit,
  MediaFeedbackReason,
  MediaFeedbackValue,
} from '../../../shared/types/index.js';
import CastChips from './CastChips.jsx';
import RecommendationFeedbackButtons from './RecommendationFeedbackButtons.jsx';

interface MediaCardInfoProps {
  title: string;
  year: number | null;
  voteAverage: number;
  genres?: { id: number; name: string }[];
  overview?: string;
  recommendationExplanationKeys?: string[];
  aiExplanation?: string | null;
  isAiPending?: boolean;
  cast?: MediaCredit[];
  currentFeedbackValue?: MediaFeedbackValue | null;
  onFeedback?: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
  onSeen?: () => void;
  isSeen?: boolean;
  children?: ReactNode;
}

function MediaCardInfo({
  title,
  year,
  voteAverage,
  genres,
  overview,
  recommendationExplanationKeys = [],
  aiExplanation = null,
  isAiPending = false,
  cast = [],
  currentFeedbackValue = null,
  onFeedback,
  onSeen,
  isSeen = false,
  children,
}: MediaCardInfoProps) {
  const { t } = useTranslation();
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const hasLongOverview = Boolean(overview && overview.length > OVERVIEW_MAX_LENGTH);

  return (
    <div className="flex h-full flex-col p-5 sm:p-7">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {t('home.resultStage')}
      </p>
      <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
        {title}
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {year && <span className="ui-chip">{year}</span>}
        <span className="ui-chip bg-accent text-on-accent">
          <AppIcon name="star" size={15} className="fill-on-accent" />
          {voteAverage.toFixed(1)}/10
        </span>
        {genres?.slice(0, 3).map((genre) => (
          <span key={genre.id} className="ui-chip">
            {genre.name}
          </span>
        ))}
      </div>

      {children}

      {onFeedback && (
        <RecommendationFeedbackButtons
          currentValue={currentFeedbackValue}
          onFeedback={onFeedback}
          onSeen={onSeen}
          isSeen={isSeen}
        />
      )}

      {overview && (
        <section className="mt-6 border-t border-line pt-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider">
            {t('media.overview')}
          </h3>
          <p className="mt-3 text-sm leading-7 text-fg/75">
            {isOverviewExpanded || !hasLongOverview
              ? overview
              : `${overview.substring(0, OVERVIEW_MAX_LENGTH)}...`}
          </p>
          {hasLongOverview && (
            <button
              type="button"
              onClick={() => setIsOverviewExpanded((previous) => !previous)}
              aria-expanded={isOverviewExpanded}
              className="mt-3 font-mono text-xs font-semibold uppercase text-accent underline decoration-2 underline-offset-4"
            >
              {isOverviewExpanded ? t('common.showLess') : t('common.showMore')}
            </button>
          )}
        </section>
      )}

      {cast.length > 0 && (
        <section className="mt-6 border-t border-line pt-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider">
            {t('common.cast')}
          </h3>
          <CastChips cast={cast} />
        </section>
      )}

      {aiExplanation && (
        <section className="mt-6 border border-accent/50 bg-accent/10 p-4">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            {t('recommendation.whyTitle')}
          </h3>
          <p className="mt-2 text-sm leading-6 text-fg/85">{aiExplanation}</p>
        </section>
      )}

      {!aiExplanation && isAiPending && (
        <p
          className="mt-6 animate-pulse border border-accent/30 bg-accent/10 p-4 text-sm text-fg/70"
          role="status"
        >
          {t('recommendation.aiLoading')}
        </p>
      )}

      {!aiExplanation && recommendationExplanationKeys.length > 0 && (
        <section className="mt-6 rounded-xl border border-line bg-surface-2 p-4">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider">
            {t('recommendation.whyTitle')}
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {recommendationExplanationKeys.map((key) => (
              <li key={key} className="flex gap-2">
                <span aria-hidden="true">—</span>
                {t(key)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default MediaCardInfo;
