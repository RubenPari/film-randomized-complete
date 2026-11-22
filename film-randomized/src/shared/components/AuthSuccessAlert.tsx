interface AuthSuccessAlertProps {
  message: string;
}

function AuthSuccessAlert({ message }: AuthSuccessAlertProps) {
  return (
    <div className="mb-5 border border-accent bg-surface p-4 text-sm text-fg" role="status">
      {message}
    </div>
  );
}

export default AuthSuccessAlert;
