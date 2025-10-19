import React from 'react';

export const Label = ({ 
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
        <span className="text-error-500 ml-1">*</span>
      )}
    </label>
  );
};

export default Label;
