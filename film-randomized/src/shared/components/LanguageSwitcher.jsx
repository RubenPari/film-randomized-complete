import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs font-bold rounded ${
          i18n.language.startsWith('en') ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
        } transition-colors duration-200`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('it')}
        className={`px-2 py-1 text-xs font-bold rounded ${
          i18n.language.startsWith('it') ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
        } transition-colors duration-200`}
      >
        IT
      </button>
    </div>
  );
}

export default LanguageSwitcher;
