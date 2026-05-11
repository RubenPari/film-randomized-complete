import useMediaTrailer from '../hooks/useMediaTrailer.js';
import MediaCardPoster from './MediaCardPoster.jsx';
import MediaCardInfo from './MediaCardInfo.jsx';
import MediaCardTrailer from './MediaCardTrailer.jsx';
import SaveButtons from './SaveButtons.jsx';
import type { MediaType, TmdbMedia } from '../../../shared/types/index.js';

interface MediaCardProps {
  media: TmdbMedia;
  mediaType: MediaType | boolean;
}

/**
 * Layout shell for the detailed media card. Composes the poster, info,
 * actions, and trailer sub-components and owns nothing beyond the
 * trailer fetch.
 */
function MediaCard({ media, mediaType }: MediaCardProps) {
  const title = media.title || media.name || '';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const trailerKey = useMediaTrailer(mediaType, media.id as number);

  return (
    <div className="media-card">
      <div className="flex flex-col md:flex-row">
        <MediaCardPoster posterPath={media.poster_path} title={title} />
        <MediaCardInfo
          title={title}
          year={year}
          voteAverage={media.vote_average ?? 0}
          genres={media.genres}
          overview={media.overview}
        >
          <SaveButtons media={media} mediaType={mediaType} />
        </MediaCardInfo>
      </div>
      <MediaCardTrailer trailerKey={trailerKey} />
    </div>
  );
}

export default MediaCard;
