/**
 * Register page component.
 * Handles new user registration with username, email, and password.
 */
import { type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import { useAuthFormAction } from '../shared/hooks/useAuthFormAction.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';
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

  const [error, submitAction, isPending] = useAuthFormAction({
    onSubmit: async (formData: FormData) => {
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      const validationError = validatePasswordForm(password, confirmPassword);
      if (validationError) {
        throw new Error(validationError);
      }

      await register(username, email, password);
      navigate('/');
    },
    getErrorMessage: (err: unknown) =>
      getErrorMessage(err, t('register.registrationError')),
  });

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
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
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
        <AuthSubmitButton
          isPending={isPending}
          idleLabel={t('register.createAccount')}
          pendingLabel={t('register.creatingAccount')}
          className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
          showArrowIcon
        />
      </form>
    </AuthFormLayout>
  );
}

export default RegisterPage;
