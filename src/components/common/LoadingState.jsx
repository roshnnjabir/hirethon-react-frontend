import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading state component with multiple variants
 * Provides consistent loading experience across the app
 */
const LoadingState = ({ 
  variant = 'spinner',
  size = 'md',
  message,
  fullscreen = false,
  overlay = false,
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const Spinner = () => (
    <Loader2 className={`${sizes[size]} text-primary-500 animate-spin`} />
  );

  const Dots = () => (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size]} rounded-full bg-primary-500 animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${sizes[size]} rounded-full bg-primary-500 animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${sizes[size]} rounded-full bg-primary-500 animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const Pulse = () => (
    <div className={`${sizes[size]} rounded-full bg-primary-500 animate-pulse`} />
  );

  const variants = {
    spinner: <Spinner />,
    dots: <Dots />,
    pulse: <Pulse />
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {variants[variant]}
      {message && (
        <p className={`${textSizes[size]} text-neutral-600 font-medium`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 z-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-xl">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

// Pre-built loading components
export const PageLoader = ({ message = 'Loading...' }) => (
  <LoadingState variant="spinner" size="lg" message={message} fullscreen />
);

export const InlineLoader = ({ size = 'sm' }) => (
  <LoadingState variant="spinner" size={size} />
);

export const OverlayLoader = ({ message }) => (
  <LoadingState variant="spinner" size="md" message={message} overlay />
);

export const ButtonLoader = () => (
  <LoadingState variant="spinner" size="sm" />
);

export default LoadingState;

