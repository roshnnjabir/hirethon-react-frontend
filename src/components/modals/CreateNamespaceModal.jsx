import React, { useState, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import FormField from '../common/FormField';

/**
 * Modal for creating a new namespace
 */
const CreateNamespaceModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

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

    onSubmit({ name: cleanName });
  }, [name, onSubmit]);

  const handleClose = useCallback(() => {
    setName('');
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Namespace"
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
            {name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-namespace' : 'my-namespace'}
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
            Create Namespace
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateNamespaceModal;

