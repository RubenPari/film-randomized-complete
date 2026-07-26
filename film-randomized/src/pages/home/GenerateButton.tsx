import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaResults } from '../../features/media/context/FilterContext.jsx';
import AppIcon from '../../shared/components/AppIcon.jsx';

interface Props {
  isLoading: boolean;
  onGenerate: () => void;
  className?: string;
}

function GenerateButton({ isLoading, onGenerate, className = '' }: Props): JSX.Element {
  const { t } = useTranslation();
  const { randomMedia } = useMediaResults();

  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`ui-button ui-button--primary w-full text-base lg:w-auto lg:min-w-56 ${className}`}
    >
      {isLoading ? (
        <>
          <span className="ui-spinner" aria-hidden="true" />
          {t('home.generating')}
        </>
      ) : (
        <>
          <AppIcon name="shuffle" size={22} />
          {t(randomMedia ? 'home.generateAgain' : 'home.generate')}
        </>
      )}
    </button>
  );
}

export default GenerateButton;
