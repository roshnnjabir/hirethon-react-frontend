import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Link as LinkIcon, 
  Users, 
  TrendingUp,
  Globe,
  Building2,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import OrganizationCard from '../../components/dashboard/OrganizationCard';
import NamespaceItem from '../../components/dashboard/NamespaceItem';
import URLItem from '../../components/dashboard/URLItem';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import CreateOrgModal from '../../components/modals/CreateOrgModal';
import CreateNamespaceModal from '../../components/modals/CreateNamespaceModal';
import CreateURLModal from '../../components/modals/CreateURLModal';
import EditOrgModal from '../../components/modals/EditOrgModal';
import EditNamespaceModal from '../../components/modals/EditNamespaceModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import { useOrganization } from '../../hooks/useOrganization';
import { useOrganizationMutations } from '../../hooks/useOrganizationMutations';
import { useNamespaceMutations } from '../../hooks/useNamespaceMutations';
import { useURLMutations } from '../../hooks/useURLMutations';
import api from '../../api/axios';

const DashboardHome = () => {
  const { user } = useAuth();
  const { activeOrg: currentOrg, setActiveOrganization: setCurrentOrg } = useOrganization();
  const navigate = useNavigate();

  // Modal states
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showCreateNamespace, setShowCreateNamespace] = useState(false);
  const [showCreateURL, setShowCreateURL] = useState(false);
  const [showEditOrg, setShowEditOrg] = useState(false);
  const [showEditNamespace, setShowEditNamespace] = useState(false);
  const [showDeleteNamespace, setShowDeleteNamespace] = useState(false);
  const [selectedNamespace, setSelectedNamespace] = useState(null);

  // Custom hooks for mutations
  const { createOrg, updateOrg } = useOrganizationMutations();
  const { createNamespace, updateNamespace, deleteNamespace } = useNamespaceMutations(currentOrg?.id);
  const { createURL } = useURLMutations(currentOrg?.id);

  // Fetch user's organizations
  const { data: organizations = [], isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await api.get('/organizations/');
      return response.data.results || response.data;
    },
  });

  // Fetch namespaces for current org
  const { data: namespaces = [], isLoading: namespacesLoading } = useQuery({
    queryKey: ['namespaces', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const response = await api.get('/namespaces/', {
        params: { organization: currentOrg.id }
      });
      return response.data.results || response.data;
    },
    enabled: !!currentOrg?.id,
  });

  // Fetch recent URLs
  const { data: recentUrls = [], isLoading: urlsLoading } = useQuery({
    queryKey: ['recent-urls', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const response = await api.get('/urls/', {
        params: {
          organization: currentOrg.id,
          limit: 5,
          ordering: '-created_at'
        }
      });
      return response.data.results || response.data;
    },
    enabled: !!currentOrg?.id,
  });

  // Set first organization as current if none selected
  useEffect(() => {
    if (organizations.length > 0 && !currentOrg) {
      setCurrentOrg(organizations[0]);
    }
  }, [organizations, currentOrg, setCurrentOrg]);

  // Memoized handlers with useCallback
  const handleCreateOrg = useCallback((data) => {
    createOrg.mutate(data, {
      onSuccess: () => setShowCreateOrg(false)
    });
  }, [createOrg]);

  const handleEditOrg = useCallback((data) => {
    if (!currentOrg) return;
    updateOrg.mutate({ id: currentOrg.id, data }, {
      onSuccess: () => setShowEditOrg(false)
    });
  }, [currentOrg, updateOrg]);

  const handleCreateNamespace = useCallback((data) => {
    createNamespace.mutate(data, {
      onSuccess: () => setShowCreateNamespace(false)
    });
  }, [createNamespace]);

  const handleEditNamespace = useCallback((namespace) => {
    setSelectedNamespace(namespace);
    setShowEditNamespace(true);
  }, []);

  const handleUpdateNamespace = useCallback((data) => {
    if (!selectedNamespace) return;
    updateNamespace.mutate({ id: selectedNamespace.id, data }, {
      onSuccess: () => {
        setShowEditNamespace(false);
        setSelectedNamespace(null);
      }
    });
  }, [selectedNamespace, updateNamespace]);

  const handleDeleteNamespace = useCallback((namespace) => {
    setSelectedNamespace(namespace);
    setShowDeleteNamespace(true);
  }, []);

  const handleConfirmDeleteNamespace = useCallback(() => {
    if (!selectedNamespace) return;
    deleteNamespace.mutate(selectedNamespace.id, {
      onSuccess: () => {
        setShowDeleteNamespace(false);
        setSelectedNamespace(null);
      }
    });
  }, [selectedNamespace, deleteNamespace]);

  const handleCreateURL = useCallback((data) => {
    createURL.mutate(data, {
      onSuccess: () => setShowCreateURL(false)
    });
  }, [createURL]);

  const handleOrgChange = useCallback((e) => {
    const org = organizations.find(o => o.id === parseInt(e.target.value));
    setCurrentOrg(org);
  }, [organizations, setCurrentOrg]);

  const handleURLClick = useCallback((url) => {
    navigate(`/urls?id=${url.id}`);
  }, [navigate]);

  // Memoized values
  const hasNamespaces = useMemo(() => namespaces.length > 0, [namespaces]);
  const displayNamespaces = useMemo(() => namespaces.slice(0, 5), [namespaces]);

  // Page header actions
  const headerActions = useMemo(() => (
    <>
      <Button
        variant="secondary"
        onClick={() => setShowCreateOrg(true)}
        icon={<Plus className="w-4 h-4" />}
      >
        New Organization
      </Button>
      {hasNamespaces && (
        <Button
          variant="primary"
          onClick={() => setShowCreateURL(true)}
          icon={<LinkIcon className="w-4 h-4" />}
        >
          Create Short URL
        </Button>
      )}
    </>
  ), [hasNamespaces]);

  // Loading state
  if (orgsLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <LoadingState type="spinner" message="Loading dashboard..." />
      </div>
    );
  }

  // No organizations state
  if (organizations.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <PageHeader title="Dashboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={Building2}
            title="Welcome to URL Shortener!"
            description="Get started by creating your first organization. You'll be able to create namespaces and shorten URLs."
            action={{
              label: 'Create Your First Organization',
              onClick: () => setShowCreateOrg(true),
              icon: <Plus className="w-5 h-5" />
            }}
          />
        </div>
        <CreateOrgModal
          isOpen={showCreateOrg}
          onClose={() => setShowCreateOrg(false)}
          onSubmit={handleCreateOrg}
          isLoading={createOrg.isPending}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${user?.name || user?.email}!`}
        subtitle="Manage your URLs and organizations"
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Selector */}
        {organizations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Current Organization</h2>
              {organizations.length > 1 && (
                <select
                  value={currentOrg?.id || ''}
                  onChange={handleOrgChange}
                  className="input-field max-w-xs"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            {currentOrg && (
              <OrganizationCard
                organization={currentOrg}
                onEdit={() => setShowEditOrg(true)}
                onCreateNamespace={() => setShowCreateNamespace(true)}
              />
            )}
          </div>
        )}

        {/* Quick Stats */}
        {currentOrg && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total URLs"
              value={recentUrls.length > 0 ? '5+' : '0'}
              icon={LinkIcon}
              iconBg="primary"
            />
            <StatsCard
              title="Namespaces"
              value={namespaces.length}
              icon={Globe}
              iconBg="info"
            />
            <StatsCard
              title="Total Clicks"
              value="0"
              icon={TrendingUp}
              iconBg="success"
            />
            <StatsCard
              title="Team Members"
              value="1"
              icon={Users}
              iconBg="neutral"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent URLs */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Recent URLs</h3>
              {currentOrg && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/urls')}
                >
                  View All
                </Button>
              )}
            </div>
            
            {urlsLoading ? (
              <LoadingState type="skeleton" count={3} />
            ) : recentUrls.length > 0 ? (
              <div className="space-y-2">
                {recentUrls.map((url) => (
                  <URLItem
                    key={url.id}
                    url={url}
                    onClick={handleURLClick}
                    showNamespace={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={LinkIcon}
                title="No URLs created yet"
                size="sm"
                action={
                  hasNamespaces
                    ? {
                        label: 'Create Your First URL',
                        onClick: () => setShowCreateURL(true),
                        icon: <Plus className="w-4 h-4" />
                      }
                    : {
                        label: 'Create Namespace First',
                        onClick: () => setShowCreateNamespace(true),
                        icon: <Plus className="w-4 h-4" />,
                        variant: 'outline'
                      }
                }
              />
            )}
          </div>

          {/* Namespaces */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Namespaces</h3>
              {currentOrg && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateNamespace(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add New
                </Button>
              )}
            </div>
            
            {namespacesLoading ? (
              <LoadingState type="skeleton" count={3} />
            ) : displayNamespaces.length > 0 ? (
              <div className="space-y-3">
                {displayNamespaces.map((namespace) => (
                  <NamespaceItem
                    key={namespace.id}
                    namespace={namespace}
                    onEdit={handleEditNamespace}
                    onDelete={handleDeleteNamespace}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Globe}
                title="No namespaces yet"
                description="Create a namespace to organize your URLs"
                size="sm"
                action={{
                  label: 'Create Namespace',
                  onClick: () => setShowCreateNamespace(true),
                  icon: <Plus className="w-4 h-4" />
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateOrgModal
        isOpen={showCreateOrg}
        onClose={() => setShowCreateOrg(false)}
        onSubmit={handleCreateOrg}
        isLoading={createOrg.isPending}
      />

      <EditOrgModal
        isOpen={showEditOrg}
        onClose={() => setShowEditOrg(false)}
        onSubmit={handleEditOrg}
        isLoading={updateOrg.isPending}
        organization={currentOrg}
      />

      <CreateNamespaceModal
        isOpen={showCreateNamespace}
        onClose={() => setShowCreateNamespace(false)}
        onSubmit={handleCreateNamespace}
        isLoading={createNamespace.isPending}
      />

      <EditNamespaceModal
        isOpen={showEditNamespace}
        onClose={() => {
          setShowEditNamespace(false);
          setSelectedNamespace(null);
        }}
        onSubmit={handleUpdateNamespace}
        isLoading={updateNamespace.isPending}
        namespace={selectedNamespace}
      />

      <ConfirmDialog
        isOpen={showDeleteNamespace}
        onClose={() => {
          setShowDeleteNamespace(false);
          setSelectedNamespace(null);
        }}
        onConfirm={handleConfirmDeleteNamespace}
        title="Delete Namespace"
        message={`Are you sure you want to delete "${selectedNamespace?.name}"? This will also delete all URLs in this namespace.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleteNamespace.isPending}
      />

      <CreateURLModal
        isOpen={showCreateURL}
        onClose={() => setShowCreateURL(false)}
        onSubmit={handleCreateURL}
        isLoading={createURL.isPending}
        namespaces={namespaces}
      />
    </div>
  );
};

export default DashboardHome;
