import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'block w-full rounded-lg border shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed px-3 py-2.5 text-sm';

  // State-based styling
  let stateClasses = '';
  if (error) {
    stateClasses = 'border-error-500 focus:border-error-500 focus:ring-error-500';
  } else if (success) {
    stateClasses = 'border-success-500 focus:border-success-500 focus:ring-success-500';
  } else {
    stateClasses = 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500';
  }

  const selectClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-1.5">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error-500">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-1.5 text-sm text-success-600">
          {success}
        </p>
      )}
    </div>
  );
};

export default Select;
