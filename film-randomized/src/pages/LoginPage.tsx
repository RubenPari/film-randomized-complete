/**
 * Login page component.
 * Handles user authentication with username and password.
 */
import { useActionState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';

/**
 * Login page component.
 * Provides a form for user authentication using React 19 useActionState.
 *
 * @returns {JSX.Element} Login page with authentication form
 */
function LoginPage(): JSX.Element {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  // React 19 action state for forms
  const [error, submitAction, isPending] = useActionState(
    async (_previousState: string | null, formData: FormData): Promise<string | null> => {
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;

      try {
        await login(username, password);
        navigate('/');
        return null;
      } catch (err) {
        return (err as Error).message || t('auth.loginError');
      }
    },
    null
  );

  return (
    <AuthFormLayout
      icon={
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
      title={t('auth.welcome')}
      subtitle={t('auth.signInToContinue')}
      error={error}
      footer={
        <p className="text-slate-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-gold hover:text-gold-soft font-bold transition-colors">
            {t('auth.createAccount')}
          </Link>
        </p>
      }
    >
      <form action={submitAction} className="space-y-5">
        <AuthTextField
          id="username"
          name="username"
          label={t('auth.username')}
          placeholder={t('auth.usernamePlaceholder')}
          autoComplete="username"
          disabled={isPending}
        />
        <AuthTextField
          id="password"
          name="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.passwordPlaceholder')}
          autoComplete="current-password"
          disabled={isPending}
          labelSuffix={
            <Link to="/forgot-password" className="text-xs font-medium text-gold hover:text-gold-soft transition-colors">
              {t('auth.forgotPassword')}
            </Link>
          }
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-3">
              <div className="loading-spinner w-5 h-5"></div>
              <span>{t('auth.signingIn')}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>{t('auth.signIn')}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default LoginPage;
