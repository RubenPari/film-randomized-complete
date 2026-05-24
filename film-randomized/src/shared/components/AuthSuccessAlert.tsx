interface AuthSuccessAlertProps {
  message: string;
}

function AuthSuccessAlert({ message }: AuthSuccessAlertProps) {
  return (
    <div className="mb-4 p-4 bg-green-900/30 text-green-200 rounded-2xl border border-green-700/50 backdrop-blur-xl animate-fade-in flex items-center gap-3">
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default AuthSuccessAlert;
