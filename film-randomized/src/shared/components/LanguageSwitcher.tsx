import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from './AppIcon.jsx';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;

  useEffect(() => {
    document.documentElement.lang = activeLanguage.startsWith('it') ? 'it' : 'en';
  }, [activeLanguage]);

  const changeLanguage = (language: 'en' | 'it') => {
    void i18n.changeLanguage(language);
  };

  return (
    <div
      className="inline-flex items-center gap-1 border-2 border-film-ink bg-white p-1"
      aria-label={t('language.label')}
    >
      <AppIcon name="language" className="mx-1" />
      {(['en', 'it'] as const).map((language) => {
        const selected = activeLanguage.startsWith(language);
        return (
          <button
            key={language}
            type="button"
            onClick={() => changeLanguage(language)}
            aria-pressed={selected}
            aria-label={t(`language.${language}`)}
            className={`min-h-8 px-2 font-mono text-xs font-semibold uppercase ${
              selected
                ? 'bg-film-blue text-white'
                : 'bg-transparent text-film-ink hover:bg-film-yellow'
            }`}
          >
            {language}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
