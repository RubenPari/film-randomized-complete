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
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';

/**
 * Forgot password page component.
 * Provides a form for requesting a password reset email.
 *
 * @returns {JSX.Element} Forgot password page with reset form
 */
function ForgotPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(t('forgotPassword.successMessage'));
    } catch (err) {
      if (import.meta.env.DEV) {
        logger.error('ForgotPasswordPage.submit', err);
      }
      setError((err as Error).message || t('forgotPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
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
        <Link to="/login" className="font-medium text-gold hover:text-gold-soft">
          {t('forgotPassword.backToLogin')}
        </Link>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {success && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200 animate-fade-in">
            <span className="text-sm">{success}</span>
          </div>
        )}

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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? t('forgotPassword.sending') : t('forgotPassword.sendResetLink')}
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default ForgotPasswordPage;
