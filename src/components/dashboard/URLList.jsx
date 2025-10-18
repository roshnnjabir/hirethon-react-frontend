import React, { useState, useMemo } from 'react';
import { Link, ExternalLink, Copy, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate, timeAgo, getShortURL, copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

const URLList = ({ 
  urls = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  className = '' 
}) => {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, url: null });
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopy = async (url) => {
    const shortUrl = getShortURL(url.namespace, url.short_code);
    const success = await copyToClipboard(shortUrl);
    
    if (success) {
      setCopiedUrl(url.id);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = (url) => {
    setDeleteDialog({ isOpen: true, url });
  };

  const confirmDelete = () => {
    if (deleteDialog.url) {
      onDelete(deleteDialog.url.id);
      setDeleteDialog({ isOpen: false, url: null });
    }
  };

  const columns = useMemo(() => [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {row.title || 'Untitled URL'}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {row.original_url}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'short_code',
      title: 'Short Code',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <code className="text-sm bg-neutral-100 px-2 py-1 rounded font-mono">
            {row.namespace}/{value}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(row)}
            icon={copiedUrl === row.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          />
        </div>
      ),
    },
    {
      key: 'click_count',
      title: 'Clicks',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-neutral-600">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'is_private',
      title: 'Status',
      render: (value, row) => (
        <div className="flex flex-col space-y-1">
          <StatusBadge 
            status={value ? 'private' : 'public'} 
            size="sm" 
          />
          {row.expires_at && new Date(row.expires_at) < new Date() && (
            <StatusBadge status="expired" size="sm" />
          )}
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
            onClick={() => onView?.(row)}
            icon={<Eye className="w-4 h-4" />}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(row)}
            icon={<Edit className="w-4 h-4" />}
            title="Edit URL"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete URL"
          />
        </div>
      ),
    },
  ], [copiedUrl, onView, onEdit]);

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
        data={urls}
        columns={columns}
        loading={loading}
        emptyMessage="No URLs found. Create your first short URL!"
        className="shadow-sm"
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, url: null })}
        onConfirm={confirmDelete}
        title="Delete URL"
        message={`Are you sure you want to delete "${deleteDialog.url?.title || 'this URL'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

export default URLList;
