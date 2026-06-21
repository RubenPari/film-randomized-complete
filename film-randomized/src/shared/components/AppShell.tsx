/**
 * Authenticated app shell: cinematic top bar with brand + primary navigation,
 * an account menu, and a mobile bottom tab bar. Wraps page content via Outlet.
 */
import { useEffect, useRef, useState, type JSX } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

interface NavItem {
  to: string;
  labelKey: string;
  icon: JSX.Element;
}

const ICON = {
  generate: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  watchlist: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  ),
  discovered: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  ),
  profile: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  ),
};

function NavIcon({ children, className }: { children: JSX.Element; className?: string }): JSX.Element {
  return (
    <svg className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {children}
    </svg>
  );
}

function AppShell(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { to: '/', labelKey: 'nav.generate', icon: ICON.generate },
    { to: '/watchlist', labelKey: 'nav.watchlist', icon: ICON.watchlist },
    { to: '/discovered', labelKey: 'nav.discovered', icon: ICON.discovered },
  ];

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive ? 'bg-gold/12 text-gold' : 'text-muted hover:text-cream'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors duration-200 ${
      isActive ? 'text-gold' : 'text-muted'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-ink-700/70 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-ink-950 shadow-gold transition-transform duration-200 group-hover:scale-105">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold tracking-tight text-cream">
                {t('nav.brand')}
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted sm:block">
                {t('nav.tagline')}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.menu')}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={desktopLinkClass}>
                <NavIcon className="h-4 w-4">{item.icon}</NavIcon>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850/70 py-1 pl-1 pr-1 backdrop-blur-sm transition-colors duration-200 hover:border-gold/40 sm:pr-3"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={t('nav.account')}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-sm font-bold text-ink-950">
                  {initial}
                </span>
                <span className="hidden max-w-[8rem] truncate text-sm font-semibold text-cream sm:block">
                  {user?.username}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-ink-700 bg-ink-850 shadow-cinema animate-fade-in"
                >
                  <div className="border-b border-ink-700/70 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-cream">{user?.username}</p>
                    <p className="truncate text-xs text-muted">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cream/90 transition-colors hover:bg-ink-800 hover:text-cream"
                    >
                      <NavIcon className="h-4 w-4 text-gold">{ICON.profile}</NavIcon>
                      {t('nav.profile')}
                    </Link>
                    <div className="my-1.5 px-3 sm:hidden">
                      <LanguageSwitcher />
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-700/70 bg-ink-900/90 backdrop-blur-xl lg:hidden"
        aria-label={t('nav.menu')}
      >
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileLinkClass}>
            <NavIcon className="h-5 w-5">{item.icon}</NavIcon>
            {t(item.labelKey)}
          </NavLink>
        ))}
        <NavLink to="/profile" className={mobileLinkClass}>
          <NavIcon className="h-5 w-5">{ICON.profile}</NavIcon>
          {t('nav.profile')}
        </NavLink>
      </nav>
    </div>
  );
}

export default AppShell;
