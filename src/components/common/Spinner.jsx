import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = null 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    'primary': 'text-primary-500',
    'success': 'text-success-500',
    'error': 'text-error-500',
    'info': 'text-info-500',
    'neutral': 'text-neutral-600',
    'white': 'text-white',
  };

  const sizeClass = sizes[size] || sizes.md;
  const colorClass = colors[color] || colors['primary'];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`${sizeClass} ${colorClass} animate-spin`} />
        {text && (
          <p className="text-sm text-neutral-600">{text}</p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
