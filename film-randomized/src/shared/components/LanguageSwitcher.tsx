import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (code: string) => i18n.language.startsWith(code);

  const optionClass = (active: boolean) =>
    `px-2.5 py-1 text-xs font-bold rounded-full transition-colors duration-200 ${
      active ? 'bg-gold text-ink-950' : 'text-muted hover:text-cream'
    }`;

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-ink-700 bg-ink-850/70 p-0.5 backdrop-blur-sm">
      <button type="button" onClick={() => changeLanguage('en')} className={optionClass(isActive('en'))}>
        EN
      </button>
      <button type="button" onClick={() => changeLanguage('it')} className={optionClass(isActive('it'))}>
        IT
      </button>
    </div>
  );
}

export default LanguageSwitcher;
