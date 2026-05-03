import React from 'react';
import LanguageSwitcher from './LanguageSwitcher.jsx';

/**
 * Shared shell for auth pages (login, register, ...). Owns the outer
 * centering layout, the language switcher, the glass card, the icon
 * header, and the error banner. Page components only supply the form
 * body and footer link.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon Badge icon rendered inside the
 *   gradient header chip.
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string|null} [props.error]
 * @param {React.ReactNode} props.children Form body.
 * @param {React.ReactNode} [props.footer] Secondary nav row under the form.
 * @param {boolean} [props.showLanguageSwitcher=true]
 */
function AuthFormLayout({
  icon,
  title,
  subtitle,
  error,
  children,
  footer,
  showLanguageSwitcher = true,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {showLanguageSwitcher && (
        <div className="mb-6">
          <LanguageSwitcher />
        </div>
      )}
      <div className="max-w-md w-full animate-fade-in">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-xl shadow-cyan-500/20">
              {icon}
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-slate-400 text-lg">{subtitle}</p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 p-4 bg-red-900/30 text-red-200 rounded-2xl border border-red-700/50 backdrop-blur-xl animate-fade-in flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {children}

          {footer && <div className="mt-8 text-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default AuthFormLayout;
