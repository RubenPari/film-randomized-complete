interface AuthSuccessAlertProps {
  message: string;
}

function AuthSuccessAlert({ message }: AuthSuccessAlertProps) {
  return (
    <div
      className="mb-5 border-2 border-film-blue bg-white p-4 text-sm text-film-ink"
      role="status"
    >
      {message}
    </div>
  );
}

export default AuthSuccessAlert;
