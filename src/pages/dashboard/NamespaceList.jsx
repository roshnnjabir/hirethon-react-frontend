import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Globe, 
  Search, 
  Filter,
  ArrowLeft,
  Edit,
  Trash2,
  Link as LinkIcon,
  BarChart3
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const NamespaceList = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNamespace, setNewNamespace] = useState({ name: '', description: '' });

  // Fetch namespaces
  const { data: namespaces = [], isLoading } = useQuery({
    queryKey: ['namespaces', orgId],
    queryFn: async () => {
      const response = await api.get('/namespaces/');
      return response.data.results || response.data;
    },
    enabled: !!orgId,
  });

  // Create namespace mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/namespaces/', data);
      return response.data;
    },
    onSuccess: (newNamespace) => {
      queryClient.invalidateQueries(['namespaces', orgId]);
      setShowCreateModal(false);
      setNewNamespace({ name: '', description: '' });
      toast.success('Namespace created successfully!');
      navigate(`/org/${orgId}/namespaces/${newNamespace.id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create namespace');
    },
  });

  // Delete namespace mutation
  const deleteMutation = useMutation({
    mutationFn: async (namespaceId) => {
      const response = await api.delete(`/namespaces/${namespaceId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['namespaces', orgId]);
      toast.success('Namespace deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete namespace');
    },
  });

  // Check namespace availability
  const checkAvailabilityMutation = useMutation({
    mutationFn: async (name) => {
      const response = await api.get(`/namespaces/check_availability/?name=${encodeURIComponent(name)}`);
      return response.data;
    },
  });

  const handleCreateNamespace = (e) => {
    e.preventDefault();
    if (!newNamespace.name.trim()) return;
    
    createMutation.mutate({
      name: newNamespace.name.trim(),
      description: newNamespace.description.trim(),
      organization: orgId
    });
  };

  const handleDeleteNamespace = (namespaceId, namespaceName) => {
    if (window.confirm(`Are you sure you want to delete the namespace "${namespaceName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(namespaceId);
    }
  };

  const handleCheckAvailability = async (name) => {
    if (name.trim()) {
      checkAvailabilityMutation.mutate(name.trim());
    }
  };

  const filteredNamespaces = namespaces.filter(namespace =>
    namespace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (namespace.description && namespace.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/org/${orgId}`)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">Namespaces</h1>
              <p className="text-neutral-600">Manage your URL namespaces</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Namespace
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search namespaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                iconPosition="left"
              />
            </div>
            <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
              Filter
            </Button>
          </div>
        </div>

        {/* Namespaces Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card">
                <div className="loading-skeleton h-4 w-3/4 mb-3"></div>
                <div className="loading-skeleton h-3 w-full mb-2"></div>
                <div className="loading-skeleton h-3 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredNamespaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNamespaces.map((namespace) => (
              <div key={namespace.id} className="card-interactive group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-primary-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{namespace.name}</h3>
                      <p className="text-sm text-neutral-600">Global namespace</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/org/${orgId}/namespaces/${namespace.id}`)}
                        icon={<Edit className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNamespace(namespace.id, namespace.name)}
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </div>

                {namespace.description && (
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {namespace.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      <span>{namespace.url_count || 0} URLs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>{namespace.total_clicks || 0} clicks</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/org/${orgId}/namespaces/${namespace.id}`)}
                    className="flex-1"
                  >
                    Manage URLs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/org/${orgId}/namespaces/${namespace.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {searchTerm ? 'No namespaces found' : 'No namespaces created yet'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first namespace to start organizing your URLs'
              }
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Your First Namespace
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Namespace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Create New Namespace</h3>
            <form onSubmit={handleCreateNamespace} className="space-y-4">
              <Input
                label="Namespace Name"
                value={newNamespace.name}
                onChange={(e) => {
                  setNewNamespace(prev => ({ ...prev, name: e.target.value }));
                  // Check availability after a delay
                  setTimeout(() => handleCheckAvailability(e.target.value), 500);
                }}
                placeholder="e.g., mycompany, marketing, support"
                required
                success={checkAvailabilityMutation.data?.available ? 'Namespace is available!' : null}
                error={checkAvailabilityMutation.data?.available === false ? 'Namespace is already taken' : null}
              />
              
              <Input
                label="Description (Optional)"
                value={newNamespace.description}
                onChange={(e) => setNewNamespace(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this namespace is for"
              />

              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Important Notes:</h4>
                <ul className="text-xs text-neutral-600 space-y-1">
                  <li>• Namespace names are globally unique across all organizations</li>
                  <li>• Once created, the name cannot be changed</li>
                  <li>• URLs will be accessible at: yourdomain.com/{newNamespace.name || 'namespace'}/shortcode</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={createMutation.isPending}
                  disabled={!newNamespace.name.trim() || checkAvailabilityMutation.data?.available === false}
                  className="flex-1"
                >
                  Create Namespace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamespaceList;
