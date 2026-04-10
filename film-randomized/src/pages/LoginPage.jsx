/**
 * Login page component.
 * Handles user authentication with username and password.
 */
import React, { useActionState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import LanguageSwitcher from '../shared/components/LanguageSwitcher.jsx';

/**
 * Login page component.
 * Provides a form for user authentication using React 19 useActionState.
 * 
 * @returns {JSX.Element} Login page with authentication form
 */
function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  // React 19 action state for forms
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const username = formData.get('username');
      const password = formData.get('password');
      
      try {
        await login(username, password);
        navigate('/');
        return null;
      } catch (err) {
        return err.message || t('auth.loginError');
      }
    },
    null
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-6">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full animate-fade-in">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-xl shadow-cyan-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              {t('auth.welcome')}
            </h1>
            <p className="text-slate-400 text-lg">{t('auth.signInToContinue')}</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/30 text-red-200 rounded-2xl border border-red-700/50 backdrop-blur-xl animate-fade-in flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form action={submitAction} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-300 mb-2">
                {t('auth.username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3.5 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder={t('auth.usernamePlaceholder')}
                disabled={isPending}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-300">
                  {t('auth.password')}
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3.5 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder={t('auth.passwordPlaceholder')}
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="loading-spinner w-5 h-5"></div>
                  <span>{t('auth.signingIn')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>{t('auth.signIn')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
