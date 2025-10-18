import React from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  placeholder,
  rows = 4,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full rounded-lg border shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed px-3 py-2.5 text-sm resize-vertical';

  // State-based styling
  let stateClasses = '';
  if (error) {
    stateClasses = 'border-brand-crimson focus:border-brand-crimson focus:ring-brand-crimson';
  } else if (success) {
    stateClasses = 'border-brand-gold focus:border-brand-gold focus:ring-brand-gold';
  } else {
    stateClasses = 'border-neutral-300 focus:border-brand-orange focus:ring-brand-orange';
  }

  const textareaClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-1.5">
          {label}
          {required && <span className="text-brand-crimson ml-1">*</span>}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={textareaClasses}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-sm text-brand-crimson">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-1.5 text-sm text-brand-gold">
          {success}
        </p>
      )}
    </div>
  );
};

export default Textarea;
