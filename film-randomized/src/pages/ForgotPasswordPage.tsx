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
  const {
    error,
    success,
    isLoading,
    setError,
    setSuccess,
    clearMessages,
    runWithLoading,
  } = useAuthFormFeedback();

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
      icon={
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.657 0-3 1.567-3 3.5S10.343 18 12 18s3-1.567 3-3.5S13.657 11 12 11zm0-9a9 9 0 100 18 9 9 0 000-18z" />
        </svg>
      }
      title={t('forgotPassword.title')}
      subtitle={t('forgotPassword.description')}
      error={error}
      footer={
        <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
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
