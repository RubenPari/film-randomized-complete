import useMediaTrailer from '../hooks/useMediaTrailer.js';
import MediaCardPoster from './MediaCardPoster.jsx';
import MediaCardInfo from './MediaCardInfo.jsx';
import MediaCardTrailer from './MediaCardTrailer.jsx';
import SaveButtons from './SaveButtons.jsx';
import type {
  MediaFeedbackReason,
  MediaFeedbackValue,
  MediaType,
  TmdbMedia,
} from '../../../shared/types/index.js';

interface MediaCardProps {
  media: TmdbMedia;
  mediaType: MediaType;
  recommendationExplanationKeys: string[];
  currentMediaFeedbackValue: MediaFeedbackValue | null;
  onFeedback: (value: MediaFeedbackValue, reason?: MediaFeedbackReason) => void;
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
  currentMediaFeedbackValue,
  onFeedback,
}: MediaCardProps) {
  const title = media.title || media.name || '';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const trailerKey = useMediaTrailer(mediaType, media.id as number);

  return (
    <article className="overflow-hidden border-2 border-film-ink bg-white shadow-[8px_8px_0_#15133C]">
      <div className="grid md:grid-cols-12">
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
            currentFeedbackValue={currentMediaFeedbackValue}
            onFeedback={onFeedback}
          >
            <SaveButtons media={media} mediaType={mediaType} />
          </MediaCardInfo>
        </div>
      </div>
      <MediaCardTrailer trailerKey={trailerKey} />
    </article>
  );
}

export default MediaCard;
