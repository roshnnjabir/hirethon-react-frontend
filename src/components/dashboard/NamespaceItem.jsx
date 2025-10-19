import React, { memo } from 'react';
import { Globe, Edit2, Trash2 } from 'lucide-react';

/**
 * Namespace list item with hover actions
 * Memoized for performance
 */
const NamespaceItem = memo(({
  namespace,
  onEdit,
  onDelete,
  onClick,
  className = '',
}) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(namespace);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(namespace);
  };

  const handleClick = () => {
    onClick?.(namespace);
  };

  // Check if this is optimistic data
  const isOptimistic = namespace._optimistic;

  return (
    <div 
      className={`
        flex items-center justify-between p-3 bg-neutral-50 rounded-lg 
        hover:bg-neutral-100 transition-all group
        ${onClick ? 'cursor-pointer' : ''}
        ${isOptimistic ? 'opacity-60 animate-pulse' : ''}
        ${className}
      `}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4 text-info-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900 truncate">{namespace.name}</p>
          <p className="text-xs text-neutral-600">{namespace.url_count || 0} URLs</p>
        </div>
      </div>
      
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-white rounded transition-colors"
              title="Edit namespace"
              aria-label={`Edit ${namespace.name}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-white rounded transition-colors"
              title="Delete namespace"
              aria-label={`Delete ${namespace.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.namespace?.id === nextProps.namespace?.id &&
    prevProps.namespace?.name === nextProps.namespace?.name &&
    prevProps.namespace?.url_count === nextProps.namespace?.url_count
  );
});

NamespaceItem.displayName = 'NamespaceItem';

export default NamespaceItem;

