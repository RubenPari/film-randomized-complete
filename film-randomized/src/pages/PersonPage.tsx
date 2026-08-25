import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppIcon from '../shared/components/AppIcon.jsx';
import { IMAGE_BASE_URL } from '../shared/constants/api.js';
import { fetchPersonDetails, fetchPersonCombinedCredits } from '../shared/services/tmdbApi.js';
import { logger } from '../shared/utils/logger.js';
import SearchResultCard from '../features/search/components/SearchResultCard.jsx';
import type { MediaType, PersonCredit, PersonDetails } from '../shared/types/index.js';

function isPlayableCredit(
  credit: PersonCredit
): credit is PersonCredit & { media_type: MediaType } {
  return credit.media_type === 'movie' || credit.media_type === 'tv';
}

function buildFilmography(
  cast: PersonCredit[],
  crew: PersonCredit[]
): { media: PersonCredit; mediaType: MediaType }[] {
  const seen = new Map<string, { media: PersonCredit; mediaType: MediaType }>();

  [...cast, ...crew].filter(isPlayableCredit).forEach((credit) => {
    const key = `${credit.media_type}-${credit.id}`;
    if (!seen.has(key)) {
      seen.set(key, { media: credit, mediaType: credit.media_type });
    }
  });

  return Array.from(seen.values()).sort(
    (a, b) => (b.media.vote_count ?? 0) - (a.media.vote_count ?? 0)
  );
}

function PersonPage() {
  const { t } = useTranslation();
  const { personId } = useParams<{ personId: string }>();

  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [filmography, setFilmography] = useState<
    { media: PersonCredit; mediaType: MediaType }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const numericId = Number(personId);

    if (Number.isNaN(numericId)) {
      setError('Invalid person ID');
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([fetchPersonDetails(numericId), fetchPersonCombinedCredits(numericId)])
      .then(([details, credits]) => {
        if (isCancelled) return;
        setPerson(details);
        setFilmography(buildFilmography(credits.cast, credits.crew));
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        setError(t('person.error'));
        logger.error('PersonPage', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [personId, t]);

  const birthDate = person?.birthday ? new Date(person.birthday).toLocaleDateString() : null;

  return (
    <div className="mx-auto min-h-full w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <Link to="/" className="ui-button ui-button--quiet mb-6 inline-flex items-center">
        <AppIcon name="arrowLeft" size={20} />
        {t('common.home')}
      </Link>

      <header className="mb-8 flex flex-wrap items-start gap-5">
        {!isLoading && person?.profile_path && (
          <img
            src={`${IMAGE_BASE_URL}${person.profile_path}`}
            alt={person.name}
            className="h-32 w-24 flex-none border-2 border-film-ink object-cover"
          />
        )}
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-film-blue">
            {t('person.eyebrow')}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
            {t('person.title', { name: person?.name || '' })}
          </h1>
          {!isLoading && person && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {person.known_for_department && (
                <span className="ui-chip">{person.known_for_department}</span>
              )}
              {birthDate && (
                <span className="ui-chip">{t('person.bornOn', { date: birthDate })}</span>
              )}
              {person.place_of_birth && (
                <span className="ui-chip">{t('person.bornIn', { place: person.place_of_birth })}</span>
              )}
            </div>
          )}
          {!isLoading && person?.biography && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-film-ink/75">{person.biography}</p>
          )}
        </div>
      </header>

      {isLoading && (
        <div className="ui-panel flex min-h-52 items-center justify-center gap-3 p-8" role="status">
          <span className="ui-spinner text-film-blue" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            {t('person.loading')}
          </span>
        </div>
      )}

      {!isLoading && error && (
        <p className="border-2 border-danger bg-white p-4 text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && filmography.length === 0 && person && (
        <p className="font-mono text-sm text-film-ink/60">{t('person.empty')}</p>
      )}

      {!isLoading && !error && filmography.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filmography.map(({ media, mediaType }) => (
            <SearchResultCard key={`${mediaType}-${media.id}`} media={media} mediaType={mediaType} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonPage;
