/**
 * 404 page for unknown routes.
 */
import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppIcon from '../shared/components/AppIcon.jsx';
import LanguageSwitcher from '../shared/components/LanguageSwitcher.jsx';

function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-film-screen p-5">
      <div className="absolute right-5 top-5">
        <LanguageSwitcher />
      </div>
      <section className="ui-panel w-full max-w-xl p-8 text-center sm:p-12">
        <AppIcon name="brand" size={80} className="mx-auto" />
        <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-film-blue">
          404
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold uppercase">{t('notFound.title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-film-ink/65">
          {t('notFound.description')}
        </p>
        <Link to="/" className="ui-button ui-button--primary mt-7">
          <AppIcon name="arrowLeft" />
          {t('notFound.goHome')}
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
