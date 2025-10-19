import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Download, Upload } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';
import { useOrganization } from '../../hooks/useOrganization';
import { useURLMutations } from '../../hooks/useURLMutations';

// Components
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import SearchFilter from '../../components/common/SearchFilter';
import BulkActions from '../../components/common/BulkActions';
import Pagination from '../../components/common/Pagination';
import URLItem from '../../components/dashboard/URLItem';
import CreateURLModal from '../../components/modals/CreateURLModal';
import URLDetailModal from '../../components/common/URLDetailModal';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Checkbox from '../../components/common/Checkbox';

const URLsPage = () => {
  const queryClient = useQueryClient();
  const { activeOrg } = useOrganization();
  const { createURL, deleteURL } = useURLMutations(activeOrg?.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Real-time updates every 30 seconds
  useRealTimeUpdates(['urls', activeOrg?.id], 30000);

  // Fetch namespaces for the create modal
  const { data: namespaces = [] } = useQuery({
    queryKey: ['namespaces', activeOrg?.id],
    queryFn: async () => {
      if (!activeOrg?.id) return [];
      const response = await api.get('/namespaces/', {
        params: { organization: activeOrg.id }
      });
      return response.data.results || response.data;
    },
    enabled: !!activeOrg?.id,
  });

  // Fetch URLs with pagination (scoped to active organization)
  const { data, isLoading } = useQuery({
    queryKey: ['urls', activeOrg?.id, currentPage, pageSize, searchTerm, filters],
    queryFn: async () => {
      if (!activeOrg?.id) return { results: [], count: 0 };
      
      const params = {
        organization: activeOrg.id,
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.isPrivate && filters.isPrivate !== 'all' && { is_private: filters.isPrivate === 'private' }),
      };

      const response = await api.get('/urls/', { params });
      return response.data;
    },
    enabled: !!activeOrg?.id,
  });

  // Handle both paginated and non-paginated responses
  const urls = useMemo(() => {
    if (!data) return [];
    return data.results || data;
  }, [data]);

  const totalCount = data?.count || urls.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Memoized handlers
  const handleCreateURL = useCallback((urlData) => {
    createURL.mutate(urlData, {
      onSuccess: () => setShowCreateModal(false)
    });
  }, [createURL]);

  const handleBulkDelete = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmBulkDelete = useCallback(async () => {
    try {
      await Promise.all(selectedUrls.map(id => api.delete(`/urls/${id}/`)));
      setSelectedUrls([]);
      setShowDeleteConfirm(false);
      toast.success(`${selectedUrls.length} URL(s) deleted successfully`);
      // Refetch data
      queryClient.invalidateQueries(['urls', activeOrg?.id]);
    } catch (error) {
      toast.error('Failed to delete URLs');
    }
  }, [selectedUrls, activeOrg, queryClient]);

  const handleSelectAll = useCallback(() => {
    if (selectedUrls.length === urls.length) {
      setSelectedUrls([]);
    } else {
      setSelectedUrls(urls.map(url => url.id));
    }
  }, [selectedUrls, urls]);

  const handleToggleSelect = useCallback((urlId) => {
    setSelectedUrls(prev => 
      prev.includes(urlId) 
        ? prev.filter(id => id !== urlId)
        : [...prev, urlId]
    );
  }, []);

  const handleURLClick = useCallback((url) => {
    setSelectedUrl(url);
  }, []);

  const handleDeleteURL = useCallback((url) => {
    deleteURL.mutate(url.id, {
      onSuccess: () => {
        if (selectedUrl?.id === url.id) {
          setSelectedUrl(null);
        }
      }
    });
  }, [deleteURL, selectedUrl]);

  // Memoized render function for list items
  const renderURLList = useCallback(() => {
    if (!urls || urls.length === 0) {
      return (
        <div className="p-12">
          <EmptyState
            icon={Plus}
            title="No URLs yet"
            description={
              namespaces.length === 0
                ? "Create a namespace first before creating URLs"
                : "Create your first short URL to get started"
            }
            action={
              namespaces.length > 0
                ? {
                    label: 'Create URL',
                    onClick: () => setShowCreateModal(true),
                    icon: <Plus className="w-4 h-4" />
                  }
                : undefined
            }
          />
        </div>
      );
    }

    return (
      <div className="divide-y divide-neutral-200">
        {urls.map((url) => (
          <div key={url.id} className="flex items-center gap-3">
            <div className="px-4 flex-shrink-0">
              <Checkbox
                checked={selectedUrls.includes(url.id)}
                onChange={() => handleToggleSelect(url.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex-1 min-w-0">
              <URLItem
                url={url}
                onClick={handleURLClick}
                onDelete={handleDeleteURL}
                showNamespace={true}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }, [urls, selectedUrls, namespaces, handleToggleSelect, handleURLClick, handleDeleteURL]);

  // Page header actions
  const headerActions = useMemo(() => (
    <>
      <Button variant="secondary" icon={<Upload className="w-4 h-4" />}>
        Import
      </Button>
      <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
        Export
      </Button>
      <Button
        variant="primary"
        onClick={() => setShowCreateModal(true)}
        icon={<Plus className="w-4 h-4" />}
        disabled={namespaces.length === 0}
      >
        Create URL
      </Button>
    </>
  ), [namespaces]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Short URLs"
        subtitle="Manage all your short links in one place"
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="mb-6">
          <SearchFilter
            onSearch={setSearchTerm}
            onFilterChange={setFilters}
            filters={filters}
            showAdvanced={true}
          />
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12">
              <LoadingState type="spinner" message="Loading URLs..." />
            </div>
          ) : (
            <>
              {renderURLList()}

              {urls.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              )}
            </>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedUrls.length > 0 && (
          <BulkActions
            selectedCount={selectedUrls.length}
            totalCount={urls.length}
            onDelete={handleBulkDelete}
            onClear={() => setSelectedUrls([])}
            onSelectAll={handleSelectAll}
          />
        )}
      </div>

      {/* Modals */}
      <CreateURLModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateURL}
        isLoading={createURL.isPending}
        namespaces={namespaces}
      />

      {selectedUrl && (
        <URLDetailModal
          url={selectedUrl}
          isOpen={!!selectedUrl}
          onClose={() => setSelectedUrl(null)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete URLs"
        message={`Are you sure you want to delete ${selectedUrls.length} URL(s)? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default URLsPage;
