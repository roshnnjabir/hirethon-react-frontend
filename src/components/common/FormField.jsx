import React from 'react';

/**
 * FormField wrapper component for consistent form field styling
 * Handles label, error messages, hints, and required indicator
 */
export const FormField = ({ 
  label, 
  error, 
  hint,
  required = false,
  children,
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-1.5">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Render children (Input, Select, Textarea, etc.) */}
      {children}
      
      {hint && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p className="mt-1.5 text-sm text-error-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
