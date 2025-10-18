import React from 'react';
import { FileX, Plus, Search } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FileX,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  actionLabel = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      
      <h3 className="text-lg font-medium text-neutral-900 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-6 max-w-sm">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          icon={<Plus className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
