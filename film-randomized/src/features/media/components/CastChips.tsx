import { Link } from 'react-router-dom';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';
import { MAX_CAST_CHIPS } from '../../../shared/constants/config.js';
import type { MediaCredit } from '../../../shared/types/index.js';

interface CastChipsProps {
  cast: MediaCredit[];
}

/** Clickable cast-member chips linking to their filmography page. */
function CastChips({ cast }: CastChipsProps) {
  const visibleCast = cast.slice(0, MAX_CAST_CHIPS);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {visibleCast.map((member) => (
        <Link
          key={member.id}
          to={`/person/${member.id}`}
          className="ui-chip gap-1.5 pl-1.5 hover:bg-film-blue/10"
        >
          {member.profile_path ? (
            <img
              src={`${IMAGE_BASE_URL}${member.profile_path}`}
              alt=""
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <AppIcon name="profile" size={14} />
          )}
          {member.name}
        </Link>
      ))}
    </div>
  );
}

export default CastChips;
