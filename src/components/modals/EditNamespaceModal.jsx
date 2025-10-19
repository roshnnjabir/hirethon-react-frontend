import React, { useState, useCallback, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import FormField from '../common/FormField';

/**
 * Modal for editing a namespace
 */
const EditNamespaceModal = ({ isOpen, onClose, onSubmit, isLoading, namespace }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Update name when namespace changes
  useEffect(() => {
    if (namespace) {
      setName(namespace.name || '');
    }
  }, [namespace]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Namespace name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Namespace name must be at least 2 characters');
      return;
    }

    // Validate namespace name (alphanumeric and hyphens only)
    const cleanName = name.toLowerCase().trim().replace(/\s+/g, '-');
    if (!/^[a-z0-9-]+$/.test(cleanName)) {
      setError('Namespace can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    if (cleanName === namespace?.name) {
      handleClose();
      return;
    }

    onSubmit({ name: cleanName });
  }, [name, namespace, onSubmit]);

  const handleClose = useCallback(() => {
    setName(namespace?.name || '');
    setError('');
    onClose();
  }, [namespace, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Namespace"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Namespace Name"
          error={error}
          required
          hint="Use lowercase letters, numbers, and hyphens only"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., my-namespace"
            autoFocus
            disabled={isLoading}
          />
        </FormField>

        <div className="text-sm text-neutral-600">
          Preview: <span className="font-mono text-neutral-900">
            {name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : namespace?.name}
          </span>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditNamespaceModal;

