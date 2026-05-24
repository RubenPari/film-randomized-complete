import type { ReactNode } from 'react';

interface AuthSubmitButtonProps {
  isPending: boolean;
  disabled?: boolean;
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  showArrowIcon?: boolean;
}

function AuthSubmitButton({
  isPending,
  disabled,
  idleLabel,
  pendingLabel,
  className = 'w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2',
  showArrowIcon = false,
}: AuthSubmitButtonProps) {
  const content: ReactNode = isPending ? (
    <div className="flex items-center justify-center gap-3">
      <div className="loading-spinner w-5 h-5"></div>
      <span>{pendingLabel}</span>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-3">
      <span>{idleLabel}</span>
      {showArrowIcon ? (
        <svg
          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ) : null}
    </div>
  );

  return (
    <button type="submit" disabled={disabled ?? isPending} className={className}>
      {content}
    </button>
  );
}

export default AuthSubmitButton;
