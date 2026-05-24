import { useState, type FormEvent, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { validatePasswordForm } from '../shared/utils/passwordValidation.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSuccessAlert from '../shared/components/AuthSuccessAlert.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import { useAuthFormFeedback } from '../shared/hooks/useAuthFormFeedback.js';

function ChangePasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
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

  const { changePassword, user } = useAuth();

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
        await changePassword(currentPassword, newPassword);
        setSuccess(t('changePassword.success'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError(getErrorMessage(err, t('changePassword.error')));
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
      title={t('changePassword.title')}
      subtitle={t('changePassword.description', { email: user?.email ?? '-' })}
      error={error}
      footer={
        <Link
          to="/"
          className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
        >
          {t('changePassword.backToHome')}
        </Link>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {success && <AuthSuccessAlert message={success} />}
        <AuthTextField
          id="currentPassword"
          name="currentPassword"
          type="password"
          label={t('changePassword.currentPassword')}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="current-password"
        />
        <AuthTextField
          id="newPassword"
          name="newPassword"
          type="password"
          label={t('changePassword.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
        <AuthTextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t('changePassword.confirmNewPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
        <AuthSubmitButton
          isPending={isLoading}
          idleLabel={t('changePassword.submit')}
          pendingLabel={t('changePassword.updating')}
        />
      </form>
    </AuthFormLayout>
  );
}

export default ChangePasswordPage;
