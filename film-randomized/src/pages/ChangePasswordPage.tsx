import { useState, type FormEvent, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { validatePasswordForm } from '../shared/utils/passwordValidation.js';
import AuthFormLayout from '../shared/components/AuthFormLayout.jsx';
import AuthTextField from '../shared/components/AuthTextField.jsx';

function ChangePasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { changePassword, user } = useAuth();

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
      await changePassword(currentPassword, newPassword);
      setSuccess(t('changePassword.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError((err as Error).message || t('changePassword.error'));
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
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 text-green-200 rounded-2xl border border-green-700/50 backdrop-blur-xl animate-fade-in flex items-center gap-3">
            <span className="text-sm">{success}</span>
          </div>
        )}
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? t('changePassword.updating') : t('changePassword.submit')}
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default ChangePasswordPage;
