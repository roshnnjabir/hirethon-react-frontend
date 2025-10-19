import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  required = false,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'bg-primary-500 border-primary-500'
              : 'border-neutral-300 hover:border-neutral-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !disabled && onChange({ target: { name, checked: !checked } })}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      
      {(label || hint) && (
        <div className="ml-3 flex-1">
          {label && (
            <label
              className={`text-sm font-medium block ${
                disabled ? 'text-neutral-400' : 'text-neutral-700'
              } ${!disabled ? 'cursor-pointer' : ''}`}
              onClick={() => !disabled && onChange({ target: { name, checked: !checked } })}
            >
              {label}
              {required && <span className="text-error-500 ml-1">*</span>}
            </label>
          )}
          {hint && (
            <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
