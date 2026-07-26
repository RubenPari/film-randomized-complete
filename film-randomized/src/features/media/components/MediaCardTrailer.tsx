import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';

interface MediaCardTrailerProps {
  trailerKey: string | null | undefined;
}

function MediaCardTrailer({ trailerKey }: MediaCardTrailerProps) {
  const { t } = useTranslation();

  if (!trailerKey) return null;

  return (
    <section className="border-t-2 border-film-ink bg-film-screen p-5 sm:p-7">
      <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
        <AppIcon name="play" className="fill-film-coral" />
        {t('common.trailer')}
      </h3>
      <div className="aspect-video w-full overflow-hidden border-2 border-film-ink bg-film-ink">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title={t('common.trailer')}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export default MediaCardTrailer;
