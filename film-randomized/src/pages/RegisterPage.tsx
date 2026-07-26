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
import AppIcon from '../shared/components/AppIcon.jsx';
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
        throw new Error(
          t(
            validationError === 'tooShort'
              ? 'register.passwordTooShort'
              : 'register.passwordsDoNotMatch'
          )
        );
      }

      await register(username, email, password);
      navigate('/');
    },
    getErrorMessage: (err: unknown) => getErrorMessage(err, t('register.registrationError')),
  });

  return (
    <AuthFormLayout
      icon={<AppIcon name="profile" size={28} />}
      title={t('register.title')}
      subtitle={t('register.description')}
      error={error}
      footer={
        <p>
          {t('register.hasAccount')}{' '}
          <Link to="/login" className="font-bold text-film-blue underline underline-offset-4">
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
          hint={t('register.passwordRequirement')}
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
          className="ui-button ui-button--primary mt-6 w-full"
          showArrowIcon
        />
      </form>
    </AuthFormLayout>
  );
}

export default RegisterPage;
