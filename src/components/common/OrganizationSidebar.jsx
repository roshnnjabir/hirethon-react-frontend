import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Users, 
  Plus, 
  UserPlus, 
  Trash2, 
  Edit,
  X,
  Crown,
  Shield,
  Eye,
  Globe,
  BarChart3
} from 'lucide-react';
import Button from './Button';
import Input from './Input';
import NamespaceManagementModal from './NamespaceManagementModal';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { handleApiError } from '../../utils/errorMessages';

const OrganizationSidebar = ({ isOpen, onClose, orgId }) => {
  const queryClient = useQueryClient();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [showNamespaceModal, setShowNamespaceModal] = useState(false);

  // Fetch organization details
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      const response = await api.get(`/organizations/${orgId}/`);
      return response.data;
    },
    enabled: !!orgId && isOpen,
  });

  // Fetch organization members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['organization-members', orgId],
    queryFn: async () => {
      const response = await api.get(`/organizations/${orgId}/members/`);
      return response.data.results || response.data;
    },
    enabled: !!orgId && isOpen,
  });

  // Fetch namespaces
  const { data: namespaces = [], isLoading: namespacesLoading } = useQuery({
    queryKey: ['namespaces', orgId],
    queryFn: async () => {
      const response = await api.get('/namespaces/');
      return response.data.results || response.data;
    },
    enabled: !!orgId && isOpen,
  });

  // Invite member mutation
  const inviteMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(`/organizations/${orgId}/invite_member/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['organization-members', orgId]);
      setShowInviteModal(false);
      setInviteEmail('');
      toast.success('Invitation sent successfully!');
    },
    onError: (error) => {
      toast.error(handleApiError(error, 'Failed to send invitation'));
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId) => {
      const response = await api.post(`/organizations/${orgId}/remove_member/`, {
        user_id: memberId
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['organization-members', orgId]);
      toast.success('Member removed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to remove member');
    },
  });

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    inviteMutation.mutate({
      email: inviteEmail,
      role: inviteRole
    });
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      removeMemberMutation.mutate(memberId);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-brand-gold" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-brand-teal" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-neutral-500" />;
      default:
        return <Shield className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-brand-gold/10 text-brand-gold border-brand-gold/20';
      case 'editor':
        return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20';
      case 'viewer':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">
                {organization?.name || 'Organization'}
              </h1>
              <p className="text-sm text-neutral-600">{organization?.slug}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Organization Stats */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="text-md font-semibold text-neutral-900 mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {namespaces.length}
                </div>
                <div className="text-neutral-600">Namespaces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {members.length}
                </div>
                <div className="text-neutral-600">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {namespaces.reduce((total, ns) => total + (ns.url_count || 0), 0)}
                </div>
                <div className="text-neutral-600">Total URLs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {namespaces.reduce((total, ns) => total + (ns.total_clicks || 0), 0)}
                </div>
                <div className="text-neutral-600">Total Clicks</div>
              </div>
            </div>
          </div>

          {/* Namespaces */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-neutral-900">Namespaces</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNamespaceModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Manage
              </Button>
            </div>
            
            {namespacesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="loading-skeleton h-16"></div>
                ))}
              </div>
            ) : namespaces.length > 0 ? (
              <div className="space-y-3">
                {namespaces.slice(0, 5).map((namespace) => (
                  <div 
                    key={namespace.id} 
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => {
                      // This would navigate to namespace detail
                      toast.info('Click to view namespace details');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900 text-sm">{namespace.name}</h4>
                        <p className="text-xs text-neutral-600">{namespace.url_count || 0} URLs</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('View namespace details');
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
                {namespaces.length > 5 && (
                  <div className="text-center">
                    <Button variant="ghost" size="sm">
                      View All ({namespaces.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Globe className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 text-sm mb-3">No namespaces created yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Create namespace coming soon!')}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Namespace
                </Button>
              </div>
            )}
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-neutral-900">Team Members</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInviteModal(true)}
                icon={<UserPlus className="w-4 h-4" />}
              >
                Invite
              </Button>
            </div>
            
            {membersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="loading-skeleton h-12"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {member.user.name || member.user.email}
                        </p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getRoleColor(member.role)}`}>
                          {getRoleIcon(member.role)}
                          {member.role}
                        </div>
                      </div>
                    </div>
                    {member.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.user.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-md font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => toast.info('Analytics coming soon!')}
                icon={<BarChart3 className="w-4 h-4" />}
                className="w-full justify-start"
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Invite Team Member</h3>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="input-field"
                >
                  <option value="viewer">Viewer - Can view URLs</option>
                  <option value="editor">Editor - Can create/edit URLs</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={inviteMutation.isPending}
                  className="flex-1"
                >
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Namespace Management Modal */}
      <NamespaceManagementModal
        isOpen={showNamespaceModal}
        onClose={() => setShowNamespaceModal(false)}
        orgId={orgId}
      />
    </>
  );
};

export default OrganizationSidebar;
