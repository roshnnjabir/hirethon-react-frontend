import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const StatusBadge = ({ 
  status, 
  type = 'default',
  size = 'sm',
  showIcon = true,
  className = '' 
}) => {
  const statusConfig = {
    active: {
      label: 'Active',
      icon: CheckCircle,
      classes: 'bg-success-50 text-success-700 border-success-200',
      iconClasses: 'text-success-600',
    },
    expired: {
      label: 'Expired',
      icon: XCircle,
      classes: 'bg-error-50 text-error-700 border-error-200',
      iconClasses: 'text-error-600',
    },
    disabled: {
      label: 'Disabled',
      icon: XCircle,
      classes: 'bg-neutral-100 text-neutral-600 border-neutral-200',
      iconClasses: 'text-neutral-500',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      iconClasses: 'text-yellow-600',
    },
    private: {
      label: 'Private',
      icon: EyeOff,
      classes: 'bg-info-100 text-info-700 border-info-200',
      iconClasses: 'text-info-600',
    },
    public: {
      label: 'Public',
      icon: Eye,
      classes: 'bg-primary-100 text-primary-700 border-primary-200',
      iconClasses: 'text-primary-600',
    },
    admin: {
      label: 'Admin',
      icon: CheckCircle,
      classes: 'bg-primary-100 text-primary-700 border-primary-200',
      iconClasses: 'text-primary-600',
    },
    editor: {
      label: 'Editor',
      icon: CheckCircle,
      classes: 'bg-info-100 text-info-700 border-info-200',
      iconClasses: 'text-info-600',
    },
    viewer: {
      label: 'Viewer',
      icon: Eye,
      classes: 'bg-neutral-100 text-neutral-600 border-neutral-200',
      iconClasses: 'text-neutral-500',
    },
  };

  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const sizeClass = sizes[size] || sizes.sm;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.classes} ${sizeClass} ${className}`}
    >
      {showIcon && <Icon className={`w-3 h-3 ${config.iconClasses}`} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
