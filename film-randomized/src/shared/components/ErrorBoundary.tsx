/**
 * Error Boundary component for React error handling.
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from './AppIcon.jsx';
import { logger } from '../utils/logger.js';
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const ErrorFallback = ({ error, errorInfo }: ErrorFallbackProps) => {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-film-screen p-6">
      <section className="ui-panel w-full max-w-md p-8 text-center" role="alert">
        <AppIcon name="alert" size={52} className="mx-auto text-danger" />
        <h1 className="mt-5 font-display text-4xl font-bold uppercase">{t('shell.errorTitle')}</h1>
        <p className="mt-3 text-sm leading-6">{t('shell.errorDescription')}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="ui-button ui-button--primary mt-6"
        >
          {t('shell.reload')}
        </button>
        {import.meta.env.DEV && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer font-mono text-xs font-semibold uppercase">
              {t('shell.errorDetails')}
            </summary>
            <pre className="mt-3 max-h-48 overflow-auto bg-film-ink p-4 text-xs text-film-screen">
              {error.toString()}
              {errorInfo?.componentStack}
            </pre>
          </details>
        )}
      </section>
    </main>
  );
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('ErrorBoundary.componentDidCatch', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
