import React, { memo } from 'react';
import { Loader2, Check, X } from 'lucide-react';

const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  optimistic = false,
  optimisticState = null, // 'success', 'error', or null
  type = 'button',
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-900 border border-neutral-200 focus:ring-neutral-500 transform hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-primary-500 bg-white hover:bg-primary-500 hover:text-white text-primary-500 focus:ring-primary-500 transform hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-error-500 hover:bg-error-600 active:bg-error-700 text-white focus:ring-error-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]',
    success: 'bg-success-500 hover:bg-success-600 active:bg-success-700 text-white focus:ring-success-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3',
  };
  
  // Optimistic state classes
  const optimisticClasses = optimistic ? {
    success: 'border-success-200 bg-success-50 text-success-700',
    error: 'border-error-200 bg-error-50 text-error-700',
    updating: 'opacity-60 pointer-events-none'
  } : {};
  
  const optimisticClass = optimistic && optimisticState ? optimisticClasses[optimisticState] : '';
  const updatingClass = optimistic && loading ? optimisticClasses.updating : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${optimisticClass} ${updatingClass} ${className}`;
  
  // Render optimistic state icons
  const renderOptimisticIcon = () => {
    if (!optimistic || !optimisticState) return null;
    
    if (optimisticState === 'success') {
      return <Check className="w-4 h-4" />;
    }
    if (optimisticState === 'error') {
      return <X className="w-4 h-4" />;
    }
    return null;
  };
  
  // Render loading or optimistic state
  const renderStateIcon = () => {
    if (loading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return renderOptimisticIcon();
  };
  
  // Render custom icon
  const renderCustomIcon = () => {
    if (!icon) return null;
    return <span className="w-4 h-4">{icon}</span>;
  };
  
  const renderContent = () => {
    const stateIcon = renderStateIcon();
    const customIcon = renderCustomIcon();
    
    if (iconPosition === 'left') {
      return (
        <>
          {stateIcon || customIcon}
          {children}
        </>
      );
    }
    
    return (
      <>
        {children}
        {stateIcon || customIcon}
      </>
    );
  };
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
