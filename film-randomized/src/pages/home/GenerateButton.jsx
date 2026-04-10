/**
 * Primary "Generate" action — shared layout for desktop and mobile sticky bar.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @param {Object} props
 * @param {boolean} props.isLoading
 * @param {() => void} props.onGenerate
 * @param {'desktop' | 'mobile'} props.variant
 */
function GenerateButton({ isLoading, onGenerate, variant }) {
  const { t } = useTranslation();

  if (variant === 'desktop') {
    return (
      <div className="text-center mb-8 hidden lg:block">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="btn-primary flex items-center mx-auto gap-2 px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-brand-accent/30"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2"></div>
              {t('common.loading')}
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isLoading}
      className="btn-primary flex items-center px-4 py-2 text-sm gap-2 shadow-lg shadow-brand-accent/30"
    >
      {isLoading ? (
        <>
          <div className="loading-spinner mr-2"></div>
          {t('common.loading')}
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
