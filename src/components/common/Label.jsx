import React from 'react';

const Label = ({ 
  children, 
  htmlFor, 
  required = false, 
  className = '',
  ...props 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-neutral-900 ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span className="text-brand-crimson ml-1">*</span>
      )}
    </label>
  );
};

export default Label;
