/**
 * Protected route component that requires authentication.
 * Redirects to login page if user is not authenticated.
 */
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AppIcon from './AppIcon.jsx';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-film-screen p-6"
        aria-busy="true"
      >
        <div className="ui-panel flex max-w-sm flex-col items-center px-10 py-12 text-center">
          <AppIcon name="brand" size={56} />
          <span className="ui-spinner my-6 text-film-blue" aria-hidden="true" />
          <p className="font-mono text-xs font-semibold uppercase tracking-wider" role="status">
            {t('shell.loadingSession')}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
