import { useState, type FormEvent, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { MIN_PASSWORD_LENGTH, validatePasswordForm } from '../shared/utils/passwordValidation.js';
import { getErrorMessage } from '../shared/utils/errorMessage.js';
import AuthTextField from '../shared/components/AuthTextField.jsx';
import AuthSuccessAlert from '../shared/components/AuthSuccessAlert.jsx';
import AuthSubmitButton from '../shared/components/AuthSubmitButton.jsx';
import AppIcon from '../shared/components/AppIcon.jsx';
import { useAuthFormFeedback } from '../shared/hooks/useAuthFormFeedback.js';

function ChangePasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { error, success, isLoading, setError, setSuccess, clearMessages, runWithLoading } =
    useAuthFormFeedback();

  const { changePassword, user } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();

    const validationError = validatePasswordForm(newPassword, confirmPassword);
    if (validationError) {
      setError(
        t(
          validationError === 'tooShort'
            ? 'changePassword.passwordTooShort'
            : 'changePassword.passwordsDoNotMatch'
        )
      );
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
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <header>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-film-blue">
          {t('navigation.profile')}
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">
          {t('changePassword.title')}
        </h1>
        <p className="mt-3 text-sm text-film-ink/65">
          {t('changePassword.description', { email: user?.email ?? '-' })}
        </p>
      </header>

      <section className="ui-panel mt-8 max-w-xl p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b-2 border-film-ink pb-5">
          <span className="flex size-12 items-center justify-center bg-film-yellow">
            <AppIcon name="profile" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider">
              {t('changePassword.account')}
            </p>
            <p className="truncate text-sm">{user?.email}</p>
          </div>
        </div>

        {error && (
          <p className="mt-5 border-2 border-danger bg-white p-4 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {success && <AuthSuccessAlert message={success} />}
          <AuthTextField
            id="currentPassword"
            name="currentPassword"
            type="password"
            label={t('changePassword.currentPassword')}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <AuthTextField
            id="newPassword"
            name="newPassword"
            type="password"
            label={t('changePassword.newPassword')}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={isLoading}
            minLength={MIN_PASSWORD_LENGTH}
            hint={t('changePassword.passwordRequirement')}
            autoComplete="new-password"
          />
          <AuthTextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label={t('changePassword.confirmNewPassword')}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <AuthSubmitButton
            isPending={isLoading}
            idleLabel={t('changePassword.submit')}
            pendingLabel={t('changePassword.updating')}
          />
        </form>
      </section>
    </div>
  );
}

export default ChangePasswordPage;
