import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Building2, 
  Link as LinkIcon, 
  Users, 
  BarChart3, 
  Settings,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useOrganization } from '../../hooks/useOrganization';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DashboardHome = () => {
  const { user } = useAuth();
  const { activeOrg: currentOrg, setActiveOrganization: setCurrentOrg } = useOrganization();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      const response = await api.get('/namespaces/');
      return response.data.results || response.data;
    },
    enabled: !!currentOrg?.id,
  });

  // Fetch recent URLs
  const { data: recentUrls = [], isLoading: urlsLoading } = useQuery({
    queryKey: ['recent-urls', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      const response = await api.get('/urls/?limit=5&ordering=-created_at');
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

  // Create organization mutation
  const createOrgMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/organizations/', data);
      return response.data;
    },
    onSuccess: (newOrg) => {
      queryClient.invalidateQueries(['organizations']);
      setCurrentOrg(newOrg);
      toast.success('Organization created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create organization');
    },
  });

  const handleCreateOrg = () => {
    const name = prompt('Enter organization name:');
    if (name) {
      createOrgMutation.mutate({ name, slug: name.toLowerCase().replace(/\s+/g, '-') });
    }
  };

  const handleCreateNamespace = () => {
    if (!currentOrg) return;
    navigate(`/org/${currentOrg.id}/namespaces`);
  };

  const handleCreateURL = () => {
    if (!currentOrg || namespaces.length === 0) {
      toast.error('Please create a namespace first');
      return;
    }
    navigate(`/org/${currentOrg.id}/namespaces/${namespaces[0].id}`);
  };

  if (orgsLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Welcome back, {user?.name || user?.email}!
              </h1>
              <p className="text-neutral-600 mt-1">
                Manage your URLs and organizations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCreateOrg}
                icon={<Plus className="w-4 h-4" />}
              >
                New Organization
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateURL}
                icon={<LinkIcon className="w-4 h-4" />}
              >
                Create URL
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Selector */}
        {organizations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Current Organization</h2>
              {organizations.length > 1 && (
                <select
                  value={currentOrg?.id || ''}
                  onChange={(e) => {
                    const org = organizations.find(o => o.id === parseInt(e.target.value));
                    setCurrentOrg(org);
                  }}
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
              <div className="card-interactive" onClick={() => navigate(`/org/${currentOrg.id}`)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-primary-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{currentOrg.name}</h3>
                      <p className="text-sm text-neutral-600">{currentOrg.slug}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {currentOrg && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total URLs</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {recentUrls.length > 0 ? '5+' : '0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Namespaces</p>
                  <p className="text-2xl font-bold text-neutral-900">{namespaces.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-skyBlue/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-skyBlue" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Team Members</p>
                  <p className="text-2xl font-bold text-neutral-900">1</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent URLs */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Recent URLs</h3>
              {currentOrg && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/org/${currentOrg.id}/namespaces`)}
                >
                  View All
                </Button>
              )}
            </div>
            
            {urlsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="loading-skeleton h-16"></div>
                ))}
              </div>
            ) : recentUrls.length > 0 ? (
              <div className="space-y-3">
                {recentUrls.map((url) => (
                  <div 
                    key={url.id} 
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/org/${currentOrg.id}/namespaces/${url.namespace_id}/url/${url.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {url.original_url}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {url.namespace}/{url.short_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">{url.click_count} clicks</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 mb-4">No URLs created yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateURL}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Your First URL
                </Button>
              </div>
            )}
          </div>

          {/* Namespaces */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Namespaces</h3>
              {currentOrg && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/org/${currentOrg.id}/namespaces`)}
                >
                  Manage
                </Button>
              )}
            </div>
            
            {namespacesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="loading-skeleton h-12"></div>
                ))}
              </div>
            ) : namespaces.length > 0 ? (
              <div className="space-y-3">
                {namespaces.slice(0, 5).map((namespace) => (
                  <div 
                    key={namespace.id} 
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/org/${currentOrg.id}/namespaces/${namespace.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{namespace.name}</p>
                        <p className="text-xs text-neutral-600">{namespace.url_count || 0} URLs</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 mb-4">No namespaces created yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateNamespace}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Namespace
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {organizations.length === 0 && (
          <div className="card text-center py-12">
            <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Welcome to URL Shortener!
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Get started by creating your first organization. You'll be able to create namespaces and shorten URLs.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateOrg}
              icon={<Plus className="w-5 h-5" />}
            >
              Create Your First Organization
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
