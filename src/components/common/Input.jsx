import React, { memo, useState, useCallback } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Input = memo(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  className = '',
  showPasswordToggle = false,
  optimistic = false,
  optimisticState = null, // 'success', 'error', or null
  icon,
  iconPosition = 'left',
  size = 'md',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type;
  
  const handlePasswordToggle = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  
  const baseClasses = `block w-full rounded-lg border shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed ${sizes[size]}`;
  
  // State-based styling
  let stateClasses = '';
  if (error || optimisticState === 'error') {
    stateClasses = 'border-error-500 focus:border-error-500 focus:ring-error-500';
  } else if (success || optimisticState === 'success') {
    stateClasses = 'border-success-500 focus:border-success-500 focus:ring-success-500';
  } else if (isFocused) {
    stateClasses = 'border-primary-500 focus:border-primary-500 focus:ring-primary-500';
  } else {
    stateClasses = 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500';
  }
  
  // Optimistic state classes
  const optimisticClasses = optimistic ? {
    success: 'bg-success-50 border-success-200',
    error: 'bg-error-50 border-error-200',
    updating: 'opacity-60'
  } : {};
  
  const optimisticClass = optimistic && optimisticState ? optimisticClasses[optimisticState] : '';
  const updatingClass = optimistic && optimisticState === 'updating' ? optimisticClasses.updating : '';
  
  const inputClasses = `${baseClasses} ${stateClasses} ${optimisticClass} ${updatingClass} ${className}`;
  
  // Render state icon
  const renderStateIcon = () => {
    if (error || optimisticState === 'error') {
      return <AlertCircle className="w-4 h-4 text-error-500" />;
    }
    if (success || optimisticState === 'success') {
      return <CheckCircle className="w-4 h-4 text-success-500" />;
    }
    return null;
  };
  
  // Render custom icon
  const renderCustomIcon = () => {
    if (!icon) return null;
    return <span className="w-4 h-4 text-neutral-400">{icon}</span>;
  };
  
  const renderLeftIcon = () => {
    const stateIcon = renderStateIcon();
    const customIcon = renderCustomIcon();
    
    if (iconPosition === 'left' && (stateIcon || customIcon)) {
      return (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {stateIcon || customIcon}
        </div>
      );
    }
    return null;
  };
  
  const renderRightIcon = () => {
    if (showPasswordToggle && type === 'password') {
      return (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
          onClick={handlePasswordToggle}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      );
    }
    
    if (iconPosition === 'right') {
      const stateIcon = renderStateIcon();
      const customIcon = renderCustomIcon();
      
      if (stateIcon || customIcon) {
        return (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {stateIcon || customIcon}
          </div>
        );
      }
    }
    
    return null;
  };
  
  // Adjust padding for icons
  const paddingClasses = iconPosition === 'left' ? 'pl-10' : '';
  const rightPaddingClasses = (showPasswordToggle && type === 'password') || (iconPosition === 'right') ? 'pr-10' : '';
  
  const finalInputClasses = `${inputClasses} ${paddingClasses} ${rightPaddingClasses}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-1.5">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={finalInputClasses}
          {...props}
        />
        
        {renderLeftIcon()}
        {renderRightIcon()}
      </div>
      
      {(error || success) && (
        <p className={`mt-1.5 text-sm flex items-center gap-1.5 ${
          error ? 'text-error-500' : 'text-success-600'
        }`}>
          {error ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
          {error || success}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
