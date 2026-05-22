/// <reference types="vite/client" />
import { useState, useEffect, type FormEvent, type JSX } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { validatePasswordForm } from '../shared/utils/passwordValidation.js';
import { logger } from '../shared/utils/logger.js';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';

function ResetPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      if (import.meta.env.DEV) {
        logger.warn('ResetPasswordPage.missingToken', 'No reset token found in URL query parameters');
      }
      setError(t('resetPassword.missingToken'));
    }
  }, [token, t]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validatePasswordForm(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (!token) {
        setError(t('resetPassword.invalidToken'));
        return;
      }
      await resetPassword(token, newPassword);
      setSuccess(t('resetPassword.success'));
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (import.meta.env.DEV) {
        logger.error('ResetPasswordPage.submit', err);
      }
      setError((err as Error).message || t('resetPassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout
      icon={
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-10a4 4 0 014 4v2m-8 0V9a4 4 0 118 0v4m-9 0h10a2 2 0 012 2v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3a2 2 0 012-2z" />
        </svg>
      }
      title={t('resetPassword.title')}
      subtitle={t('resetPassword.description')}
      error={error}
      footer={
        <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
          {t('resetPassword.backToLogin')}
        </Link>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 text-green-200 rounded-2xl border border-green-700/50 backdrop-blur-xl animate-fade-in flex items-center gap-3">
            <span className="text-sm">{success}</span>
          </div>
        )}

        <AuthTextField
          id="newPassword"
          name="newPassword"
          type="password"
          label={t('resetPassword.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={Boolean(!token || success || isLoading)}
          autoComplete="new-password"
        />
        <AuthTextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t('resetPassword.confirmNewPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={Boolean(!token || success || isLoading)}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={Boolean(isLoading || !token || success)}
          className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? t('resetPassword.resetting') : t('resetPassword.submit')}
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default ResetPasswordPage;
