/**
 * Forgot password page component.
 * Handles password reset email requests.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import LanguageSwitcher from '../shared/components/LanguageSwitcher.jsx';

/**
 * Forgot password page component.
 * Provides a form for requesting a password reset email.
 *
 * @returns {JSX.Element} Forgot password page with reset form
 */
function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(t('forgotPassword.successMessage'));
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Forgot password component error:', err);
      }
      setError(err.message || t('forgotPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <LanguageSwitcher />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {t('forgotPassword.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {t('forgotPassword.description')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-900 border border-green-500 text-green-200 px-4 py-3 rounded relative">
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                {t('forgotPassword.emailLabel')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
              >
                {isLoading ? t('forgotPassword.sending') : t('forgotPassword.sendResetLink')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
