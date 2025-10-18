import React from 'react';
import Input from './Input';
import { Label } from './Label';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  success,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  helpText,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        success={success}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      
      {helpText && !error && !success && (
        <p className="text-sm text-neutral-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;
