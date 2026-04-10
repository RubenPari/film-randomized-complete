/**
 * 404 page for unknown routes.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-3">{t('notFound.title')}</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">{t('notFound.description')}</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-accent to-brand-deep hover:opacity-95 text-white font-medium transition-opacity shadow-lg shadow-brand-accent/25"
      >
        {t('notFound.goHome')}
      </Link>
    </div>
  );
}

export default NotFoundPage;
