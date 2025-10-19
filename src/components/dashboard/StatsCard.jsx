import React, { memo } from 'react';

/**
 * Reusable stat card component with icon, value, and optional change indicator
 * Memoized for performance
 */
const StatsCard = memo(({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon: Icon,
  iconBg = 'primary', // 'primary', 'success', 'error', 'info', 'neutral'
  loading = false,
  className = '',
}) => {
  const changeColors = {
    positive: 'text-success-600',
    negative: 'text-error-600',
    neutral: 'text-neutral-500',
  };

  const changeBgColors = {
    positive: 'bg-success-100',
    negative: 'bg-error-100',
    neutral: 'bg-neutral-100',
  };

  const iconBgColors = {
    primary: 'bg-primary-100',
    success: 'bg-success-100',
    error: 'bg-error-100',
    info: 'bg-info-100',
    neutral: 'bg-neutral-100',
  };

  const iconColors = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    error: 'text-error-600',
    info: 'text-info-600',
    neutral: 'text-neutral-600',
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-neutral-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 ${iconBgColors[iconBg]} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColors[iconBg]}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 truncate">
            {value}
          </p>
          {change !== undefined && change !== null && (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${changeBgColors[changeType]} ${changeColors[changeType]}`}>
              <span>{change > 0 ? '↑' : change < 0 ? '↓' : '•'}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.change === nextProps.change &&
    prevProps.loading === nextProps.loading
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
