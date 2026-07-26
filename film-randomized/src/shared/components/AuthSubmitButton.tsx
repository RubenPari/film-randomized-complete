import AppIcon from './AppIcon.jsx';

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
  className = 'ui-button ui-button--primary mt-2 w-full',
  showArrowIcon = false,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled ?? isPending}
      aria-busy={isPending}
      className={className}
    >
      {isPending ? (
        <>
          <span className="ui-spinner" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {idleLabel}
          {showArrowIcon && <AppIcon name="arrowLeft" className="rotate-180" />}
        </>
      )}
    </button>
  );
}

export default AuthSubmitButton;
