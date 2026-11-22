import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from './AppIcon.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

interface AuthFormLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  error?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  showLanguageSwitcher?: boolean;
}

function AuthFormLayout({
  icon,
  title,
  subtitle,
  error,
  children,
  footer,
  showLanguageSwitcher = true,
}: AuthFormLayoutProps) {
  const { t } = useTranslation();

  return (
    <main className="relative min-h-screen bg-canvas p-3 sm:p-5">
      {showLanguageSwitcher && (
        <div className="absolute right-5 top-5 z-10">
          <LanguageSwitcher />
        </div>
      )}
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-6xl grid-cols-[minmax(0,1fr)] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/40 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[repeat(5,minmax(0,1fr))]">
        <aside className="hidden flex-col justify-between bg-surface p-10 text-fg lg:col-span-2 lg:flex">
          <div className="flex items-center gap-3">
            <AppIcon name="brand" size={46} />
            <span className="font-display text-2xl font-bold uppercase leading-none">
              Film/
              <br />
              Randomized
            </span>
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t('auth.brandEyebrow')}
            </p>
            <p className="mt-4 font-display text-6xl font-bold uppercase leading-[0.85]">
              {t('auth.brandTitle')}
            </p>
            <p className="mt-6 max-w-xs text-sm leading-7 text-fg/70">
              {t('auth.brandDescription')}
            </p>
          </div>
          <div className="h-1.5 rounded-full bg-accent" aria-hidden="true" />
        </aside>

        <section className="flex min-h-full flex-col lg:col-span-3">
          <header className="flex items-center gap-3 border-b border-line p-4 pr-32 lg:hidden">
            <AppIcon name="brand" size={38} />
            <span className="min-w-0 truncate font-display text-xl font-bold uppercase">
              Film/Randomized
            </span>
          </header>
          <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
            <div className="w-full max-w-md">
              <span className="flex size-14 items-center justify-center rounded-xl border border-line bg-accent text-on-accent">
                {icon}
              </span>
              <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-none">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-fg/65">{subtitle}</p>

              {error && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-danger bg-surface p-4 text-danger"
                >
                  <AppIcon name="alert" className="mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="mt-7">{children}</div>
              {footer && <div className="mt-7 border-t border-line pt-5 text-sm">{footer}</div>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthFormLayout;
