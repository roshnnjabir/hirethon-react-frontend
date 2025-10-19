import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Users, 
  Settings, 
  Plus, 
  UserPlus, 
  Trash2, 
  Edit,
  ArrowLeft,
  Crown,
  Shield,
  Eye
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const OrganizationDetail = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  // Fetch organization details
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      const response = await api.get(`/organizations/${orgId}/`);
      return response.data;
    },
    enabled: !!orgId,
  });

  // Fetch organization members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['organization-members', orgId],
    queryFn: async () => {
      const response = await api.get(`/organizations/${orgId}/members/`);
      return response.data.results || response.data;
    },
    enabled: !!orgId,
  });

  // Fetch namespaces
  const { data: namespaces = [], isLoading: namespacesLoading } = useQuery({
    queryKey: ['namespaces', orgId],
    queryFn: async () => {
      const response = await api.get('/namespaces/');
      return response.data.results || response.data;
    },
    enabled: !!orgId,
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
      toast.error(error.response?.data?.error || 'Failed to send invitation');
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

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Organization not found</h3>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-primary-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">{organization.name}</h1>
                  <p className="text-neutral-600">{organization.slug}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              icon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Namespaces */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">Namespaces</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/org/${orgId}/namespaces`)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Namespace
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
                  {namespaces.map((namespace) => (
                    <div 
                      key={namespace.id} 
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/org/${orgId}/namespaces/${namespace.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900">{namespace.name}</h3>
                          <p className="text-sm text-neutral-600">{namespace.url_count || 0} URLs</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/org/${orgId}/namespaces/${namespace.id}`);
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-4">No namespaces created yet</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/org/${orgId}/namespaces`)}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Create Your First Namespace
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">Team Members</h3>
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
                          <p className="text-sm font-medium text-neutral-900">{member.user.name || member.user.email}</p>
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

            {/* Organization Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total URLs</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Clicks</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Namespaces</span>
                  <span className="font-medium">{namespaces.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Team Members</span>
                  <span className="font-medium">{members.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
    </div>
  );
};

export default OrganizationDetail;
