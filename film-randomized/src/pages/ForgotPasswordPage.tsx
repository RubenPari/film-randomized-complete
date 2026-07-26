/// <reference types="vite/client" />
/**
 * Forgot password page component.
 * Handles password reset email requests.
 */
import { useState, type FormEvent, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { logger } from '../shared/utils/logger.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSuccessAlert from '../shared/components/AuthSuccessAlert.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import AppIcon from '../shared/components/AppIcon.jsx';
import { useAuthFormFeedback } from '../shared/hooks/useAuthFormFeedback.js';

/**
 * Forgot password page component.
 * Provides a form for requesting a password reset email.
 *
 * @returns {JSX.Element} Forgot password page with reset form
 */
function ForgotPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const { forgotPassword } = useAuth();
  const { error, success, isLoading, setError, setSuccess, clearMessages, runWithLoading } =
    useAuthFormFeedback();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();

    await runWithLoading(async () => {
      try {
        await forgotPassword(email);
        setSuccess(t('forgotPassword.successMessage'));
      } catch (err) {
        if (import.meta.env.DEV) {
          logger.error('ForgotPasswordPage.submit', err);
        }
        setError(getErrorMessage(err, t('forgotPassword.errorMessage')));
      }
    });
  };

  return (
    <AuthFormLayout
      icon={<AppIcon name="alert" size={28} />}
      title={t('forgotPassword.title')}
      subtitle={t('forgotPassword.description')}
      error={error}
      footer={
        <Link to="/login" className="font-bold text-film-blue underline underline-offset-4">
          {t('forgotPassword.backToLogin')}
        </Link>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {success && <AuthSuccessAlert message={success} />}

        <AuthTextField
          id="email"
          name="email"
          type="email"
          label={t('forgotPassword.emailLabel')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <AuthSubmitButton
          isPending={isLoading}
          idleLabel={t('forgotPassword.sendResetLink')}
          pendingLabel={t('forgotPassword.sending')}
        />
      </form>
    </AuthFormLayout>
  );
}

export default ForgotPasswordPage;
