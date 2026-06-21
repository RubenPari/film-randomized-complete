/**
 * Primary "Generate" action. Full-width gold button used at the top of the
 * results column on every screen size.
 */
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isLoading: boolean;
  onGenerate: () => void;
}

function GenerateButton({ isLoading, onGenerate }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isLoading}
      className="btn-primary w-full py-4 text-base"
    >
      {isLoading ? (
        <>
          <span className="loading-spinner h-5 w-5 border-ink-950/30 border-t-ink-950" />
          {t('common.loading')}
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {t('home.generate')}
        </>
      )}
    </button>
  );
}

export default GenerateButton;
