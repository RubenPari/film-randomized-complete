import type { ChangeEvent, ReactNode } from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3.5 bg-ink-800/60 border border-ink-700 rounded-xl text-cream placeholder-muted/70 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/40 transition-all duration-200 backdrop-blur-sm disabled:opacity-50';

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
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
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
  value,
  onChange,
}: AuthTextFieldProps) {
  return (
    <div>
      {labelSuffix ? (
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={id} className="block text-sm font-semibold text-cream/90">
            {label}
          </label>
          {labelSuffix}
        </div>
      ) : (
        <label htmlFor={id} className="block text-sm font-semibold text-cream/90 mb-2">
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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

export default AuthTextField;
