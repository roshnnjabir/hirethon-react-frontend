import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Globe } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import FormField from './FormField';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import api from '../../api/axios';
import { useNamespaceMutations } from '../../hooks/useNamespaceMutations';

/**
 * Modal for managing namespaces (create, edit, delete) with optimistic UI
 */
const NamespaceManagementModal = ({ isOpen, onClose, orgId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNamespace, setEditingNamespace] = useState(null);
  const [deletingNamespace, setDeletingNamespace] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  // Get namespaces for this org
  const { data: namespaces = [], isLoading } = useQuery({
    queryKey: ['namespaces', orgId],
    queryFn: async () => {
      const response = await api.get('/namespaces/', {
        params: { organization: orgId }
      });
      return response.data.results || response.data;
    },
    enabled: !!orgId && isOpen,
  });

  // Use optimistic mutations hook
  const { createNamespace, updateNamespace, deleteNamespace } = useNamespaceMutations(orgId);

  // Handle create
  const handleCreate = useCallback((e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Namespace name is required');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Namespace name must be at least 2 characters');
      return;
    }

    const cleanName = formData.name.toLowerCase().trim().replace(/\s+/g, '-');
    if (!/^[a-z0-9-]+$/.test(cleanName)) {
      setError('Namespace can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    createNamespace.mutate(
      { name: cleanName },
      {
        onSuccess: () => {
          setFormData({ name: '' });
          setShowCreateForm(false);
        },
      }
    );
  }, [formData.name, createNamespace]);

  // Handle edit
  const handleEdit = useCallback((e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Namespace name is required');
      return;
    }

    const cleanName = formData.name.toLowerCase().trim().replace(/\s+/g, '-');
    if (!/^[a-z0-9-]+$/.test(cleanName)) {
      setError('Namespace can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    if (cleanName === editingNamespace.name) {
      setEditingNamespace(null);
      setFormData({ name: '' });
      return;
    }

    updateNamespace.mutate(
      {
        id: editingNamespace.id,
        data: { name: cleanName },
      },
      {
        onSuccess: () => {
          setEditingNamespace(null);
          setFormData({ name: '' });
        },
      }
    );
  }, [formData.name, editingNamespace, updateNamespace]);

  // Handle delete
  const handleDelete = useCallback(() => {
    if (!deletingNamespace) return;

    deleteNamespace.mutate(deletingNamespace.id, {
      onSuccess: () => {
        setDeletingNamespace(null);
      },
    });
  }, [deletingNamespace, deleteNamespace]);

  // Start editing
  const startEdit = useCallback((namespace) => {
    setEditingNamespace(namespace);
    setFormData({ name: namespace.name });
    setShowCreateForm(false);
    setError('');
  }, []);

  // Start creating
  const startCreate = useCallback(() => {
    setShowCreateForm(true);
    setEditingNamespace(null);
    setFormData({ name: '' });
    setError('');
  }, []);

  // Cancel form
  const cancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingNamespace(null);
    setFormData({ name: '' });
    setError('');
  }, []);

  // Close modal
  const handleClose = useCallback(() => {
    cancelForm();
    onClose();
  }, [cancelForm, onClose]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Manage Namespaces"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Create/Edit Form */}
          {(showCreateForm || editingNamespace) && (
            <form
              onSubmit={editingNamespace ? handleEdit : handleCreate}
              className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                {editingNamespace ? 'Edit Namespace' : 'Create New Namespace'}
              </h4>
              <FormField
                label="Namespace Name"
                error={error}
                hint="Use lowercase letters, numbers, and hyphens only"
                required
              >
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="e.g., my-namespace"
                  autoFocus
                  disabled={createNamespace.isPending || updateNamespace.isPending}
                />
              </FormField>

              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={createNamespace.isPending || updateNamespace.isPending}
                >
                  {editingNamespace ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={cancelForm}
                  disabled={createNamespace.isPending || updateNamespace.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Add Button */}
          {!showCreateForm && !editingNamespace && (
            <Button
              variant="outline"
              size="sm"
              onClick={startCreate}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Namespace
            </Button>
          )}

          {/* Namespaces List */}
          <div className="space-y-2">
            {isLoading ? (
              <LoadingState type="skeleton" count={3} />
            ) : namespaces.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="No namespaces yet"
                description="Create your first namespace to organize URLs"
                size="sm"
              />
            ) : (
              namespaces.map((namespace) => {
                const isOptimistic = namespace._optimistic;
                const isEditing = editingNamespace?.id === namespace.id;

                return (
                  <div
                    key={namespace.id}
                    className={`
                      flex items-center justify-between p-3 bg-white rounded-lg 
                      border border-neutral-200 transition-all
                      ${isOptimistic ? 'opacity-60 animate-pulse' : ''}
                      ${isEditing ? 'ring-2 ring-primary-500' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-info-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {namespace.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {namespace.url_count || 0} URLs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => startEdit(namespace)}
                        disabled={isOptimistic}
                        className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-neutral-100 rounded transition-colors disabled:opacity-50"
                        title="Edit namespace"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingNamespace(namespace)}
                        disabled={isOptimistic}
                        className="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-neutral-100 rounded transition-colors disabled:opacity-50"
                        title="Delete namespace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingNamespace}
        onClose={() => setDeletingNamespace(null)}
        onConfirm={handleDelete}
        title="Delete Namespace"
        message={`Are you sure you want to delete "${deletingNamespace?.name}"? This will also delete all URLs in this namespace.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleteNamespace.isPending}
      />
    </>
  );
};

export default NamespaceManagementModal;
