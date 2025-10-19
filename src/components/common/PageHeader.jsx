import React, { memo } from 'react';

/**
 * Reusable page header component
 * Memoized for performance
 */
const PageHeader = memo(({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div className={`bg-white border-b border-neutral-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-neutral-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3 flex-shrink-0 ml-6">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;

