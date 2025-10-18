import React, { useState, useMemo } from 'react';
import { FolderOpen, Plus, Edit, Trash2, Eye, Link as LinkIcon } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate, timeAgo } from '../../utils/helpers';

const NamespaceList = ({ 
  namespaces = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  onViewURLs,
  className = '' 
}) => {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, namespace: null });

  const handleDelete = (namespace) => {
    setDeleteDialog({ isOpen: true, namespace });
  };

  const confirmDelete = () => {
    if (deleteDialog.namespace) {
      onDelete(deleteDialog.namespace.id);
      setDeleteDialog({ isOpen: false, namespace: null });
    }
  };

  const columns = useMemo(() => [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-brand-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {value}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {row.description || 'No description'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'url_count',
      title: 'URLs',
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <span className="text-sm font-medium text-neutral-900">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'total_clicks',
      title: 'Total Clicks',
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <span className="text-sm text-neutral-600">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'created_at',
      title: 'Created',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-neutral-600">
          <div>{formatDate(value)}</div>
          <div className="text-xs text-neutral-500">
            {timeAgo(value)}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewURLs?.(row)}
            icon={<LinkIcon className="w-4 h-4" />}
            title="View URLs"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(row)}
            icon={<Eye className="w-4 h-4" />}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(row)}
            icon={<Edit className="w-4 h-4" />}
            title="Edit Namespace"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Namespace"
          />
        </div>
      ),
    },
  ], [onViewURLs, onView, onEdit]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Table
        data={namespaces}
        columns={columns}
        loading={loading}
        emptyMessage="No namespaces found. Create your first namespace!"
        className="shadow-sm"
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, namespace: null })}
        onConfirm={confirmDelete}
        title="Delete Namespace"
        message={`Are you sure you want to delete "${deleteDialog.namespace?.name}"? This will also delete all URLs in this namespace. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

export default NamespaceList;
