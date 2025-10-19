import React, { memo } from 'react';

/**
 * Reusable section card wrapper component
 * Memoized for performance
 */
const SectionCard = memo(({
  title,
  subtitle,
  actions,
  children,
  className = '',
  loading = false,
}) => {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.loading === nextProps.loading
  );
});

SectionCard.displayName = 'SectionCard';

export default SectionCard;

