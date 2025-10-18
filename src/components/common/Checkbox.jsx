import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
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
              ? 'bg-brand-orange border-brand-orange'
              : 'border-neutral-300 hover:border-neutral-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !disabled && onChange({ target: { name, checked: !checked } })}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      
      {label && (
        <label
          className={`ml-3 text-sm font-medium ${
            disabled ? 'text-neutral-400' : 'text-neutral-700'
          } ${!disabled ? 'cursor-pointer' : ''}`}
          onClick={() => !disabled && onChange({ target: { name, checked: !checked } })}
        >
          {label}
          {required && <span className="text-brand-crimson ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
