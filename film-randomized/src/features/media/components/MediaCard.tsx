import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMediaTrailer from '../hooks/useMediaTrailer.js';
import MediaCardPoster from './MediaCardPoster.jsx';
import MediaCardInfo from './MediaCardInfo.jsx';
import MediaCardTrailer from './MediaCardTrailer.jsx';
import SaveButtons from './SaveButtons.jsx';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import { BACKDROP_BASE_URL } from '../../../shared/constants/api.js';
import type {
  MediaCredit,
  MediaFeedbackReason,
  MediaFeedbackValue,
  MediaType,
  TmdbMedia,
} from '../../../shared/types/index.js';

interface MediaCardProps {
  media: TmdbMedia;
  mediaType: MediaType;
  recommendationExplanationKeys: string[];
  aiExplanation?: string | null;
  isAiPending?: boolean;
  cast?: MediaCredit[];
  currentMediaFeedbackValue: MediaFeedbackValue | null;
  onFeedback: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
  onSeen?: () => void;
  isSeen?: boolean;
}

/**
 * Layout shell for the detailed media card. Composes the poster, info,
 * actions, and trailer sub-components and owns nothing beyond the
 * trailer fetch.
 */
function MediaCard({
  media,
  mediaType,
  recommendationExplanationKeys,
  aiExplanation = null,
  isAiPending = false,
  cast = [],
  currentMediaFeedbackValue,
  onFeedback,
  onSeen,
  isSeen = false,
}: MediaCardProps) {
  const { t } = useTranslation();
  const [showTrailer, setShowTrailer] = useState(false);
  const title = media.title || media.name || '';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const trailerKey = useMediaTrailer(mediaType, media.id as number);
  const mediaId = media.id as number;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/40">
      {media.backdrop_path && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={`${BACKDROP_BASE_URL}${media.backdrop_path}`}
            alt=""
            className="size-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/30" />
        </div>
      )}
      <div className="relative grid md:grid-cols-12">
        <div className="md:col-span-5">
          <MediaCardPoster posterPath={media.poster_path} title={title} />
        </div>
        <div className="md:col-span-7">
          <MediaCardInfo
            title={title}
            year={year}
            voteAverage={media.vote_average ?? 0}
            genres={media.genres}
            overview={media.overview}
            recommendationExplanationKeys={recommendationExplanationKeys}
            aiExplanation={aiExplanation}
            isAiPending={isAiPending}
            cast={cast}
            currentFeedbackValue={currentMediaFeedbackValue}
            onFeedback={onFeedback}
            onSeen={onSeen}
            isSeen={isSeen}
          >
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                to={`/similar/${mediaType}/${mediaId}`}
                className="ui-button ui-button--secondary inline-flex items-center gap-1.5 text-sm"
              >
                <AppIcon name="similar" size={18} />
                {t('similar.action')}
              </Link>
              <SaveButtons media={media} mediaType={mediaType} />
              {trailerKey && (
                <button
                  type="button"
                  onClick={() => setShowTrailer((prev) => !prev)}
                  className="ui-button ui-button--secondary inline-flex items-center gap-1.5 text-sm"
                  aria-expanded={showTrailer}
                >
                  <AppIcon name="play" size={18} className="fill-film-coral" />
                  {showTrailer ? t('common.hideTrailer') : t('common.showTrailer')}
                </button>
              )}
            </div>
          </MediaCardInfo>
        </div>
      </div>
      {showTrailer && trailerKey && <MediaCardTrailer trailerKey={trailerKey} />}
    </article>
  );
}

export default MediaCard;
