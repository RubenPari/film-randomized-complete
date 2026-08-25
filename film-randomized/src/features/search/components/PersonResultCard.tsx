import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';
import type { PersonSearchResult } from '../../../shared/types/index.js';

interface PersonResultCardProps {
  person: PersonSearchResult;
}

function PersonResultCard({ person }: PersonResultCardProps) {
  const { t } = useTranslation();
  const knownForTitles = (person.known_for ?? [])
    .map((item) => item.title || item.name || '')
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  return (
    <Link
      to={`/person/${person.id}`}
      className="flex h-full flex-col overflow-hidden border-2 border-film-ink bg-white"
    >
      <div className="aspect-[2/3] overflow-hidden bg-film-ink">
        {person.profile_path ? (
          <img
            src={`${IMAGE_BASE_URL}${person.profile_path}`}
            alt={person.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-3 bg-film-blue p-4 text-center text-white">
            <AppIcon name="profile" size={48} />
            <span className="font-mono text-[0.65rem] font-semibold uppercase">
              {t('common.noImage')}
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {person.known_for_department && (
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-film-blue">
            {person.known_for_department}
          </p>
        )}
        <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 sm:text-base">
          {person.name}
        </h2>
        {knownForTitles && (
          <p className="mt-2 line-clamp-2 text-xs text-film-ink/60">{knownForTitles}</p>
        )}
      </div>
    </Link>
  );
}

export default PersonResultCard;
