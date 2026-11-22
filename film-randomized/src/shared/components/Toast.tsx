/* eslint-disable react-refresh/only-export-components -- provider and hook belong together */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppIcon from './AppIcon.jsx';

interface ToastInput {
  message: string;
  tone?: 'success' | 'danger';
  link?: { to: string; label: string };
}

const TOAST_MS = 6000;

// Outside a provider (e.g. isolated component tests) showing a toast is a no-op.
const ToastContext = createContext<(toast: ToastInput) => void>(() => undefined);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [toast, setToast] = useState<(ToastInput & { id: number }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const nextId = useRef(0);

  const dismiss = useCallback(() => setToast(null), []);
  const show = useCallback((input: ToastInput) => {
    clearTimeout(timer.current);
    setToast({ ...input, id: nextId.current++ });
    timer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-20 z-[80] flex justify-center lg:inset-x-auto lg:right-6 lg:top-6"
      >
        {toast && (
          <div
            key={toast.id}
            className={`film-frame-enter pointer-events-auto flex w-full max-w-sm items-center gap-3 border bg-surface p-3 text-sm shadow-xl shadow-black/40 ${
              toast.tone === 'danger' ? 'border-danger text-danger' : 'border-success text-fg'
            }`}
            style={{ borderRadius: '0.75rem' }}
          >
            <p className="min-w-0 flex-1 font-semibold">{toast.message}</p>
            {toast.link && (
              <Link
                to={toast.link.to}
                onClick={dismiss}
                className="shrink-0 font-bold text-accent underline underline-offset-2"
              >
                {toast.link.label}
              </Link>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="ui-icon-button size-8 shrink-0 text-fg"
              aria-label={t('toast.dismiss')}
            >
              <AppIcon name="close" size={16} />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
