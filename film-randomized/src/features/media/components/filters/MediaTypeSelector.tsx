import { useTranslation } from 'react-i18next';
import type { MediaType } from '../../../../shared/types/index.js';

interface MediaTypeSelectorProps {
  mediaType: MediaType;
  setMediaType: (val: MediaType) => void;
}

function MediaTypeSelector({ mediaType, setMediaType }: MediaTypeSelectorProps) {
  const { t } = useTranslation();

  return (
    <fieldset>
      <legend className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider">
        {t('filters.mediaType')}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {(['movie', 'tv'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMediaType(type)}
            aria-pressed={mediaType === type}
            className={`min-h-11 rounded-xl border border-line px-3 py-2 text-sm font-bold ${
              mediaType === type
                ? 'bg-accent text-on-accent'
                : 'bg-surface text-fg hover:bg-surface-2'
            }`}
          >
            {type === 'movie' ? t('common.movies') : t('common.tvShows')}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default MediaTypeSelector;
