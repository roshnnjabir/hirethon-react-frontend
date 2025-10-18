import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  className = '',
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const variants = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-brand-crimson',
      iconBg: 'bg-error-50',
      confirmVariant: 'danger',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
      confirmVariant: 'secondary',
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-brand-teal',
      iconBg: 'bg-brand-teal/10',
      confirmVariant: 'primary',
    },
  };

  const config = variants[variant] || variants.danger;
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className={className}
    >
      <div className="text-center">
        <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {title}
        </h3>

        <p className="text-neutral-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
