import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from './ProtectedRoute.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import AppIcon, { type AppIconName } from './AppIcon.jsx';
import { ToastProvider } from './Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const APP_DESTINATIONS: readonly {
  to: string;
  labelKey: string;
  icon: AppIconName;
}[] = [
  { to: '/', labelKey: 'navigation.discover', icon: 'discover' },
  { to: '/search', labelKey: 'navigation.search', icon: 'search' },
  { to: '/watchlist', labelKey: 'common.watchlist', icon: 'watchlist' },
  { to: '/discovered', labelKey: 'common.discovered', icon: 'seen' },
  { to: '/profile', labelKey: 'navigation.profile', icon: 'profile' },
];

const Brand = () => (
  <NavLink to="/" className="inline-flex items-center gap-3" aria-label="Film/Randomized">
    <AppIcon name="brand" size={38} />
    <span className="font-display text-xl font-bold uppercase leading-none tracking-wide">
      Film/
      <br />
      Randomized
    </span>
  </NavLink>
);

const NavItems = ({ mobile = false }: { mobile?: boolean }) => {
  const { t } = useTranslation();

  return APP_DESTINATIONS.map(({ to, labelKey, icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'group flex items-center font-bold',
          mobile
            ? 'min-w-0 flex-1 flex-col justify-center gap-1 px-0.5 py-2 text-[0.6rem]'
            : 'gap-3 rounded-xl border border-transparent px-3 py-3 text-sm',
          isActive
            ? 'border-accent/40 bg-accent/15 text-accent'
            : 'hover:border-line hover:bg-surface',
        ].join(' ')
      }
    >
      <AppIcon name={icon} size={mobile ? 22 : 20} />
      <span className={mobile ? 'truncate' : ''}>{t(labelKey)}</span>
    </NavLink>
  ));
};

function MainAppLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ProtectedRoute>
      <ToastProvider>
        <div className="min-h-screen bg-canvas text-fg">
          <a
            href="#main-content"
            className="fixed left-4 top-3 z-[70] -translate-y-24 bg-accent px-4 py-2 font-bold focus:translate-y-0"
          >
            {t('shell.skipToContent')}
          </a>

          <aside className="fixed inset-y-0 left-0 z-40 hidden w-[216px] flex-col border-r border-line bg-canvas p-5 lg:flex">
            <Brand />
            <nav className="mt-12 flex flex-col gap-2" aria-label={t('navigation.primary')}>
              <NavItems />
            </nav>
            <div className="mt-auto border-t border-line pt-5">
              <LanguageSwitcher />
              <div className="mt-5 min-w-0">
                <p className="truncate text-sm font-bold">{user?.username}</p>
                <p className="truncate font-mono text-[0.65rem] text-fg/65">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="ui-button ui-button--quiet mt-4 w-full justify-start"
              >
                <AppIcon name="logout" />
                {t('common.logout')}
              </button>
            </div>
          </aside>

          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas px-4 lg:hidden">
            <Brand />
            <NavLink
              to="/profile"
              className="flex min-w-0 items-center gap-2 font-bold"
              aria-label={t('navigation.profile')}
            >
              <span className="hidden max-w-32 truncate text-sm min-[390px]:block">
                {user?.username}
              </span>
              <span className="ui-icon-button">
                <AppIcon name="profile" />
              </span>
            </NavLink>
          </header>

          <main id="main-content" className="pb-safe-tabs min-h-screen lg:ml-[216px] lg:pb-0">
            <Outlet />
          </main>

          <nav
            className="safe-area-bottom fixed inset-x-0 bottom-0 z-50 flex h-[calc(4.5rem+env(safe-area-inset-bottom))] border-t border-line bg-canvas lg:hidden"
            aria-label={t('navigation.primary')}
          >
            <NavItems mobile />
          </nav>
        </div>
      </ToastProvider>
    </ProtectedRoute>
  );
}

export default MainAppLayout;
