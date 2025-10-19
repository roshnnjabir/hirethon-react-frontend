import React, { useState, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import FormField from '../common/FormField';

/**
 * Modal for creating a new organization
 */
const CreateOrgModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    if (name.trim().length < 3) {
      setError('Organization name must be at least 3 characters');
      return;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    onSubmit({ name: name.trim(), slug });
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
      title="Create New Organization"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Organization Name"
          error={error}
          required
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., My Company"
            autoFocus
            disabled={isLoading}
          />
        </FormField>

        <div className="text-sm text-neutral-600">
          Slug: <span className="font-mono text-neutral-900">
            {name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-company' : 'my-company'}
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
            Create Organization
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrgModal;

