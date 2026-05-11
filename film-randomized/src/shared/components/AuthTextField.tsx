import { ReactNode } from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3.5 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm';

interface AuthTextFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  autoComplete?: string;
  labelSuffix?: ReactNode;
}

function AuthTextField({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = true,
  disabled = false,
  minLength,
  autoComplete,
  labelSuffix,
}: AuthTextFieldProps) {
  return (
    <div>
      {labelSuffix ? (
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={id} className="block text-sm font-bold text-slate-300">
            {label}
          </label>
          {labelSuffix}
        </div>
      ) : (
        <label htmlFor={id} className="block text-sm font-bold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

export default AuthTextField;
