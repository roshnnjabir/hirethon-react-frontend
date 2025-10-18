import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ 
  size = 'md', 
  color = 'brand-orange', 
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
    'brand-orange': 'text-brand-orange',
    'brand-teal': 'text-brand-teal',
    'brand-gold': 'text-brand-gold',
    'brand-crimson': 'text-brand-crimson',
    'neutral-600': 'text-neutral-600',
    'white': 'text-white',
  };

  const sizeClass = sizes[size] || sizes.md;
  const colorClass = colors[color] || colors['brand-orange'];

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
