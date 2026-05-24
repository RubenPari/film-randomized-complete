/// <reference types="vite/client" />
import { useState, useEffect, type FormEvent, type JSX } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { validatePasswordForm } from '../shared/utils/passwordValidation.js';
import { logger } from '../shared/utils/logger.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSuccessAlert from '../shared/components/AuthSuccessAlert.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import { useAuthFormFeedback } from '../shared/hooks/useAuthFormFeedback.js';

function ResetPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {
    error,
    success,
    isLoading,
    setError,
    setSuccess,
    clearMessages,
    runWithLoading,
  } = useAuthFormFeedback();

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
  }, [token, t, setError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();

    const validationError = validatePasswordForm(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    await runWithLoading(async () => {
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
        setError(getErrorMessage(err, t('resetPassword.error')));
      }
    });
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
        {success && <AuthSuccessAlert message={success} />}

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
        <AuthSubmitButton
          isPending={isLoading}
          disabled={Boolean(isLoading || !token || success)}
          idleLabel={t('resetPassword.submit')}
          pendingLabel={t('resetPassword.resetting')}
        />
      </form>
    </AuthFormLayout>
  );
}

export default ResetPasswordPage;
