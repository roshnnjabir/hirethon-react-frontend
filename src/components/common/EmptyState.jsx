import React from 'react';
import { FileQuestion, Link2, BarChart3, Settings, Search, AlertCircle, Inbox } from 'lucide-react';

/**
 * Empty state component for better first-time user experience
 * Shows helpful messages and actions when no data is available
 */
const EmptyState = ({ 
  variant = 'default',
  title,
  description,
  icon: Icon,
  action,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  className = ''
}) => {
  // Pre-defined variants
  const variants = {
    urls: {
      icon: Link2,
      title: 'No URLs yet',
      description: 'Create your first short URL to get started. Share links easily with custom short codes.',
      actionLabel: 'Create Short URL'
    },
    analytics: {
      icon: BarChart3,
      title: 'No analytics data',
      description: 'Analytics will appear here once your URLs start getting clicks. Share your links to see insights!',
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search or filters to find what you\'re looking for.',
    },
    error: {
      icon: AlertCircle,
      title: 'Something went wrong',
      description: 'We couldn\'t load this data. Please try again or contact support if the problem persists.',
      actionLabel: 'Try Again'
    },
    organizations: {
      icon: Inbox,
      title: 'No organizations',
      description: 'Create an organization to start managing your short URLs and collaborate with your team.',
      actionLabel: 'Create Organization'
    },
    namespaces: {
      icon: FileQuestion,
      title: 'No namespaces',
      description: 'Namespaces help you organize your URLs. Create one to get started.',
      actionLabel: 'Create Namespace'
    },
    settings: {
      icon: Settings,
      title: 'No settings configured',
      description: 'Configure your preferences to customize your experience.',
    }
  };

  // Use variant or custom props
  const config = variants[variant] || {};
  const FinalIcon = Icon || config.icon || Inbox;
  const finalTitle = title || config.title || 'No data';
  const finalDescription = description || config.description || 'There\'s nothing here yet.';
  const finalActionLabel = actionLabel || config.actionLabel;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* Icon */}
      <div className="
        w-20 h-20 rounded-full 
        bg-neutral-100 border-2 border-neutral-200
        flex items-center justify-center
        mb-6
      ">
        <FinalIcon className="w-10 h-10 text-neutral-400" />
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
        {finalTitle}
      </h3>
      <p className="text-neutral-600 text-center max-w-md mb-8">
        {finalDescription}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && finalActionLabel && (
            <button
              onClick={action}
              className="
                bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                text-white font-medium px-6 py-2.5 rounded-lg
                transition-all duration-200 shadow-sm hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                inline-flex items-center gap-2
              "
            >
              {finalActionLabel}
            </button>
          )}
          
          {secondaryAction && secondaryActionLabel && (
            <button
              onClick={secondaryAction}
              className="
                bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300
                text-neutral-900 font-medium px-6 py-2.5 rounded-lg
                border border-neutral-200
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              "
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-built empty state components
export const EmptyURLs = ({ onCreate }) => (
  <EmptyState
    variant="urls"
    action={onCreate}
  />
);

export const EmptySearch = ({ onClear }) => (
  <EmptyState
    variant="search"
    action={onClear}
    actionLabel="Clear Filters"
  />
);

export const EmptyAnalytics = () => (
  <EmptyState variant="analytics" />
);

export const ErrorState = ({ onRetry, error }) => (
  <EmptyState
    variant="error"
    description={error || 'We couldn\'t load this data. Please try again or contact support if the problem persists.'}
    action={onRetry}
  />
);

export default EmptyState;
