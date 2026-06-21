import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';

interface AuthFormLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  error?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  showLanguageSwitcher?: boolean;
  /** When rendered inside the authenticated AppShell (e.g. profile), drops the
   * full-screen backdrop, brand mark, and language switcher. */
  embedded?: boolean;
}

function AuthFormLayout({
  icon,
  title,
  subtitle,
  error,
  children,
  footer,
  showLanguageSwitcher = true,
  embedded = false,
}: AuthFormLayoutProps) {
  const { t } = useTranslation();

  return (
    <div
      className={
        embedded
          ? 'flex w-full flex-col items-center px-4 py-12'
          : 'relative flex min-h-screen flex-col items-center justify-center p-4'
      }
    >
      {/* Cinematic backdrop */}
      {!embedded && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-cinema-backdrop bg-cover bg-center" />
          <div className="absolute inset-0 bg-ink-950/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/80" />
        </div>
      )}

      {/* Brand mark */}
      {!embedded && (
        <div className="relative z-10 mb-8 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-ink-950 shadow-gold">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" />
            </svg>
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-cream">
            {t('nav.brand')}
          </span>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="rounded-3xl border border-ink-700/70 bg-ink-850/85 p-8 shadow-cinema backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-ink-950 shadow-gold">
              {icon}
            </div>
            <h1 className="font-display text-3xl font-extrabold text-cream">{title}</h1>
            <p className="mt-2 text-base text-muted">{subtitle}</p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200 animate-fade-in"
            >
              <svg
                className="h-5 w-5 flex-shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {children}

          {footer && <div className="mt-8 text-center text-sm">{footer}</div>}
        </div>

        {showLanguageSwitcher && !embedded && (
          <div className="mt-6 flex justify-center">
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthFormLayout;
