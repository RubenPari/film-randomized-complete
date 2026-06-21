/**
 * Register page component.
 * Handles new user registration with username, email, and password.
 */
import { useActionState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import { validatePasswordForm, MIN_PASSWORD_LENGTH } from '../shared/utils/passwordValidation.js';

/**
 * Register page component.
 * Provides a form for user registration using React 19 useActionState.
 *
 * @returns {JSX.Element} Register page with registration form
 */
function RegisterPage(): JSX.Element {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  // React 19 action state for forms
  const [error, submitAction, isPending] = useActionState(
    async (_previousState: string | null, formData: FormData): Promise<string | null> => {
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      const validationError = validatePasswordForm(password, confirmPassword);
      if (validationError) {
        return validationError;
      }

      try {
        await register(username, email, password);
        navigate('/');
        return null;
      } catch (err) {
        return (err as Error).message || t('register.registrationError');
      }
    },
    null
  );

  return (
    <AuthFormLayout
      icon={
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      }
      title={t('register.title')}
      subtitle={t('register.description')}
      error={error}
      footer={
        <p className="text-slate-400">
          {t('register.hasAccount')}{' '}
          <Link to="/login" className="text-gold hover:text-gold-soft font-bold transition-colors">
            {t('register.signInInstead')}
          </Link>
        </p>
      }
    >
      <form action={submitAction} className="space-y-4">
        <AuthTextField
          id="username"
          name="username"
          label={t('register.username')}
          placeholder={t('register.usernamePlaceholder')}
          autoComplete="username"
          disabled={isPending}
        />
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label={t('register.email')}
          placeholder={t('register.emailPlaceholder')}
          autoComplete="email"
          disabled={isPending}
        />
        <AuthTextField
          id="password"
          name="password"
          type="password"
          label={t('register.password')}
          minLength={MIN_PASSWORD_LENGTH}
          placeholder={t('register.passwordPlaceholder')}
          autoComplete="new-password"
          disabled={isPending}
        />
        <AuthTextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t('register.confirmPassword')}
          placeholder={t('register.confirmPasswordPlaceholder')}
          autoComplete="new-password"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-3">
              <div className="loading-spinner w-5 h-5"></div>
              <span>{t('register.creatingAccount')}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>{t('register.createAccount')}</span>
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

export default RegisterPage;
