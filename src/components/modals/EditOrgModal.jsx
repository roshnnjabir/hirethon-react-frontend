import React, { useState, useCallback, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import FormField from '../common/FormField';

/**
 * Modal for editing an organization
 */
const EditOrgModal = ({ isOpen, onClose, onSubmit, isLoading, organization }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Update name when organization changes
  useEffect(() => {
    if (organization) {
      setName(organization.name || '');
    }
  }, [organization]);

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

    if (name.trim() === organization?.name) {
      handleClose();
      return;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    onSubmit({ name: name.trim(), slug });
  }, [name, organization, onSubmit]);

  const handleClose = useCallback(() => {
    setName(organization?.name || '');
    setError('');
    onClose();
  }, [organization, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Organization"
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
          New slug: <span className="font-mono text-neutral-900">
            {name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : organization?.slug}
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

export default EditOrgModal;

