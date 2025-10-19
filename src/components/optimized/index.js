/**
 * Optimized component wrappers with React.memo
 * Prevents unnecessary re-renders for better performance
 */
import React from 'react';

/**
 * Memoized card component
 */
export const MemoizedCard = React.memo(({ children, className = '', onClick, ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200
        p-6 shadow-sm transition-shadow duration-200
        hover:shadow-md
        ${onClick ? 'cursor-pointer hover:border-primary-500 hover:scale-102 active:scale-98' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these props change
  return (
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.onClick === nextProps.onClick
  );
});

MemoizedCard.displayName = 'MemoizedCard';

/**
 * Memoized button component
 */
export const MemoizedButton = React.memo(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-900 border border-neutral-200 focus:ring-neutral-500',
    ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-error-500 hover:bg-error-600 active:bg-error-700 text-white shadow-sm hover:shadow-md focus:ring-error-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
});

MemoizedButton.displayName = 'MemoizedButton';

/**
 * Memoized badge component
 */
export const MemoizedBadge = React.memo(({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    success: 'bg-success-100 text-success-700 border-success-200',
    error: 'bg-error-100 text-error-700 border-error-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    info: 'bg-info-100 text-info-700 border-info-200',
  };

  return (
    <span className={`
      inline-flex items-center gap-1
      px-2.5 py-1 rounded-full
      text-xs font-medium border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
});

MemoizedBadge.displayName = 'MemoizedBadge';

/**
 * Memoized stat card
 */
export const MemoizedStatCard = React.memo(({
  title,
  value,
  change,
  trend,
  icon: Icon,
  className = ''
}) => {
  const trendColor = trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-error-600' : 'text-neutral-600';

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${trendColor}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.change === nextProps.change &&
    prevProps.trend === nextProps.trend
  );
});

MemoizedStatCard.displayName = 'MemoizedStatCard';

/**
 * Memoized list item
 */
export const MemoizedListItem = React.memo(({
  children,
  onClick,
  className = ''
}) => {
  return (
    <div
      className={`
        p-4 border-b border-neutral-200 last:border-b-0
        ${onClick ? 'cursor-pointer hover:bg-neutral-50 active:bg-neutral-100' : ''}
        transition-colors duration-150
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

MemoizedListItem.displayName = 'MemoizedListItem';

/**
 * Memoized input component
 */
export const MemoizedInput = React.memo(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-lg
            ${Icon ? 'pl-10' : ''}
            border ${error ? 'border-error-500' : 'border-neutral-300'}
            bg-white text-neutral-900
            placeholder:text-neutral-400
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-error-500 focus:border-error-500' : 'focus:ring-primary-500 focus:border-primary-500'}
            transition-colors duration-200
            disabled:bg-neutral-100 disabled:cursor-not-allowed
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.disabled === nextProps.disabled
  );
});

MemoizedInput.displayName = 'MemoizedInput';

export default {
  MemoizedCard,
  MemoizedButton,
  MemoizedBadge,
  MemoizedStatCard,
  MemoizedListItem,
  MemoizedInput,
};

