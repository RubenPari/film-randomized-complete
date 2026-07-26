import type { ChangeEvent, ReactNode } from 'react';

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
  hint?: string;
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
  hint,
  value,
  onChange,
}: AuthTextFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-bold">
          {label}
        </label>
        {labelSuffix}
      </div>
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
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="ui-field"
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-film-ink/65">
          {hint}
        </p>
      )}
    </div>
  );
}

export default AuthTextField;
