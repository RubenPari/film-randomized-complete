/**
 * Home top bar: language, user info, watchlist link, logout.
 */
import { type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx';

interface Props {
  user: { username?: string; email?: string } | null;
  onLogout: () => void;
}

function HomeHeader({ user, onLogout }: Props): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <LanguageSwitcher />
      <div className="flex items-center gap-4 glass-effect rounded-xl border border-brand-accent/20 px-5 py-3 shadow-lg shadow-brand-accent/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-highlight to-brand-deep flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-200 font-semibold">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/watchlist"
          className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm hover:scale-105 transition-transform duration-200"
          title={t('common.watchlist')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="hidden md:inline">{t('common.watchlist')}</span>
        </Link>
        <Link
          to="/discovered"
          className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm hover:scale-105 transition-transform duration-200"
          title={t('common.discovered')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="hidden lg:inline">{t('common.discovered')}</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 border-red-500 text-white hover:scale-105 transition-transform duration-200"
          title={t('common.logout')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden md:inline">{t('common.logout')}</span>
        </button>
      </div>
    </div>
  );
}

export default HomeHeader;
