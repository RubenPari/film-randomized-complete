import React from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3.5 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm';

/**
 * Styled text input used in every auth form. Exists purely so the long
 * Tailwind class list is defined once and every input pair (login,
 * register, reset, ...) stays visually identical.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.name
 * @param {string} [props.type='text']
 * @param {string} props.label
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required=true]
 * @param {boolean} [props.disabled]
 * @param {number} [props.minLength]
 * @param {string} [props.autoComplete]
 * @param {React.ReactNode} [props.labelSuffix] Optional element rendered
 *   on the right side of the label row (e.g. a "forgot password" link).
 */
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
}) {
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
