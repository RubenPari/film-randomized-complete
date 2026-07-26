/// <reference types="vite/client" />
import { useState, type FormEvent, type JSX } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { MIN_PASSWORD_LENGTH, validatePasswordForm } from '../shared/utils/passwordValidation.js';
import { logger } from '../shared/utils/logger.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSuccessAlert from '../shared/components/AuthSuccessAlert.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import AppIcon from '../shared/components/AppIcon.jsx';
import { useAuthFormFeedback } from '../shared/hooks/useAuthFormFeedback.js';

function ResetPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { error, success, isLoading, setError, setSuccess, clearMessages, runWithLoading } =
    useAuthFormFeedback();

  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();

    const validationError = validatePasswordForm(newPassword, confirmPassword);
    if (validationError) {
      setError(
        t(
          validationError === 'tooShort'
            ? 'resetPassword.passwordTooShort'
            : 'resetPassword.passwordsDoNotMatch'
        )
      );
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

  if (!token) {
    return (
      <AuthFormLayout
        icon={<AppIcon name="alert" size={28} />}
        title={t('resetPassword.title')}
        subtitle={t('resetPassword.description')}
        error={t('resetPassword.invalidToken')}
        footer={
          <Link to="/login" className="font-bold text-film-blue underline underline-offset-4">
            {t('resetPassword.backToLogin')}
          </Link>
        }
      >
        <span />
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      icon={<AppIcon name="alert" size={28} />}
      title={t('resetPassword.title')}
      subtitle={t('resetPassword.description')}
      error={error}
      footer={
        <Link to="/login" className="font-bold text-film-blue underline underline-offset-4">
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
          minLength={MIN_PASSWORD_LENGTH}
          hint={t('resetPassword.passwordRequirement')}
          disabled={Boolean(success || isLoading)}
          autoComplete="new-password"
        />
        <AuthTextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t('resetPassword.confirmNewPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={Boolean(success || isLoading)}
          autoComplete="new-password"
        />
        <AuthSubmitButton
          isPending={isLoading}
          disabled={Boolean(isLoading || success)}
          idleLabel={t('resetPassword.submit')}
          pendingLabel={t('resetPassword.resetting')}
        />
      </form>
    </AuthFormLayout>
  );
}

export default ResetPasswordPage;
