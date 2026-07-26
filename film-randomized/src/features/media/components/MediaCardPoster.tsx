import { useTranslation } from 'react-i18next';
import AppIcon from '../../../shared/components/AppIcon.jsx';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';

interface MediaCardPosterProps {
  posterPath: string | null | undefined;
  title: string;
}

function MediaCardPoster({ posterPath, title }: MediaCardPosterProps) {
  const { t } = useTranslation();
  const sprockets = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="relative flex h-full min-h-80 bg-film-ink p-4 sm:p-5">
      <div className="absolute inset-y-3 left-1.5 flex flex-col justify-around" aria-hidden="true">
        {sprockets.map((index) => (
          <span key={index} className="block h-4 w-2 bg-film-yellow" />
        ))}
      </div>
      <div className="absolute inset-y-3 right-1.5 flex flex-col justify-around" aria-hidden="true">
        {sprockets.map((index) => (
          <span key={index} className="block h-4 w-2 bg-film-yellow" />
        ))}
      </div>
      {posterPath ? (
        <img
          src={`${IMAGE_BASE_URL}${posterPath}`}
          alt={title}
          className="min-h-full w-full object-cover"
        />
      ) : (
        <div className="flex min-h-96 w-full flex-col items-center justify-center bg-film-blue p-8 text-center text-white">
          <AppIcon name="brand" size={64} />
          <span className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider">
            {t('common.noImage')}
          </span>
        </div>
      )}
    </div>
  );
}

export default MediaCardPoster;
