import React, { memo } from 'react';
import { Building2, Edit2, Plus } from 'lucide-react';
import Button from '../common/Button';

/**
 * Organization card component with edit functionality
 * Memoized for performance
 */
const OrganizationCard = memo(({
  organization,
  onEdit,
  onCreateNamespace,
  className = '',
}) => {
  if (!organization) return null;

  // Check if this is optimistic data
  const isOptimistic = organization._optimistic;

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm transition-all ${isOptimistic ? 'opacity-60 animate-pulse' : ''} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-neutral-900 truncate">{organization.name}</h3>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-neutral-400 hover:text-primary-500 transition-colors p-1 rounded hover:bg-neutral-100 flex-shrink-0"
                  title="Edit organization name"
                  aria-label="Edit organization"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-neutral-600 truncate">{organization.slug}</p>
          </div>
        </div>
        {onCreateNamespace && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateNamespace}
              icon={<Plus className="w-4 h-4" />}
            >
              New Namespace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.organization?.id === nextProps.organization?.id &&
    prevProps.organization?.name === nextProps.organization?.name &&
    prevProps.organization?.slug === nextProps.organization?.slug &&
    prevProps.organization?._optimistic === nextProps.organization?._optimistic
  );
});

OrganizationCard.displayName = 'OrganizationCard';

export default OrganizationCard;

