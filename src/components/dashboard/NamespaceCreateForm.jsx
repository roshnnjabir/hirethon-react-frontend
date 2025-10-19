import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Button from '../common/Button';
import Input from '../common/Input';
import FormField from '../common/FormField';
import { useNamespaceMutations } from '../../hooks/useNamespaceMutations';

/**
 * Form for creating a new namespace with optimistic UI
 */
const NamespaceCreateForm = ({ organizationId, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  // Use optimistic mutation hook
  const { createNamespace } = useNamespaceMutations(organizationId);

  const handleSubmit = useCallback(
    (e) => {
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

      // Create with optimistic update
      createNamespace.mutate(
        { name: cleanName },
        {
          onSuccess: (data) => {
            setName('');
            setError('');
            onSuccess?.(data);
          },
          onError: (err) => {
            // Error is already handled by the hook with toast
            // Just set local error for form display
            const errorMsg =
              err.response?.data?.name?.[0] ||
              err.response?.data?.error ||
              'Failed to create namespace';
            setError(errorMsg);
          },
        }
      );
    },
    [name, organizationId, createNamespace, onSuccess]
  );

  const handleCancel = useCallback(() => {
    setName('');
    setError('');
    onCancel?.();
  }, [onCancel]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Namespace Name"
        error={error}
        required
        hint="Use lowercase letters, numbers, and hyphens only. Example: my-namespace"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., my-namespace"
          autoFocus
          disabled={createNamespace.isPending}
        />
      </FormField>

      <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Preview:</p>
        <code className="text-primary-600">
          {name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'my-namespace'}
        </code>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={createNamespace.isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={createNamespace.isPending}
        >
          Create Namespace
        </Button>
      </div>
    </form>
  );
};

export default NamespaceCreateForm;
