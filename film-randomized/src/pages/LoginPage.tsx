/**
 * Login page component.
 * Handles user authentication with username and password.
 */
import { type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import AppIcon from '../shared/components/AppIcon.jsx';
import { useAuthFormAction } from '../shared/hooks/useAuthFormAction.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';

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

  const [error, submitAction, isPending] = useAuthFormAction({
    onSubmit: async (formData: FormData) => {
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;
      await login(username, password);
      navigate('/');
    },
    getErrorMessage: (err: unknown) => getErrorMessage(err, t('auth.loginError')),
  });

  return (
    <AuthFormLayout
      icon={<AppIcon name="profile" size={28} />}
      title={t('auth.welcome')}
      subtitle={t('auth.signInToContinue')}
      error={error}
      footer={
        <p>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-film-blue underline underline-offset-4">
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
            <Link to="/forgot-password" className="text-xs font-bold text-film-blue underline">
              {t('auth.forgotPassword')}
            </Link>
          }
        />

        <AuthSubmitButton
          isPending={isPending}
          idleLabel={t('auth.signIn')}
          pendingLabel={t('auth.signingIn')}
          className="ui-button ui-button--primary mt-6 w-full"
          showArrowIcon
        />
      </form>
    </AuthFormLayout>
  );
}

export default LoginPage;
