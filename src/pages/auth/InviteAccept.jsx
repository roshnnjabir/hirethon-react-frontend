import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserPlus, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  Mail,
  Users,
  Crown,
  Edit,
  Eye
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const InviteAccept = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('verify'); // 'verify', 'register', 'success'

  // Fetch invite details
  const { data: invite, isLoading: inviteLoading, error: inviteError } = useQuery({
    queryKey: ['invite', token],
    queryFn: async () => {
      const response = await api.get(`/organizations/verify_invite/${token}/`);
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });

  // Accept invite mutation
  const acceptInviteMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(`/organizations/accept_invite/${token}/`, data);
      return response.data;
    },
    onSuccess: () => {
      setStep('success');
      queryClient.invalidateQueries(['organizations']);
      toast.success('Welcome to the team!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to accept invitation');
    },
  });

  useEffect(() => {
    if (isAuthenticated && invite) {
      setStep('register');
    }
  }, [isAuthenticated, invite]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAcceptInvite = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await acceptInviteMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirm: formData.confirmPassword,
      });
    } catch (error) {
      console.error('Accept invite error:', error);
    } finally {
      setIsLoading(false);
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
        return <Users className="w-4 h-4 text-neutral-500" />;
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

  if (inviteLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (inviteError || !invite) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-error-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Invalid Invitation</h1>
          <p className="text-neutral-600 mb-6">
            This invitation link is invalid or has expired. Please contact the organization administrator for a new invitation.
          </p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome to the Team!</h1>
          <p className="text-neutral-600 mb-6">
            You've successfully joined <strong>{invite.organization.name}</strong> as a <strong>{invite.role}</strong>.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            You're Invited!
          </h1>
          <p className="text-neutral-600">
            Join <strong>{invite.organization.name}</strong>
          </p>
        </div>

        {/* Invitation Details */}
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-brand-orange" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">{invite.organization.name}</h2>
            <p className="text-sm text-neutral-600">{invite.organization.slug}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">Invited as</span>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getRoleColor(invite.role)}`}>
                {getRoleIcon(invite.role)}
                {invite.role}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Role Permissions:</h3>
              <ul className="text-xs text-neutral-600 space-y-1">
                {invite.role === 'admin' && (
                  <>
                    <li>• Create and manage namespaces</li>
                    <li>• Create, edit, and delete URLs</li>
                    <li>• Invite and manage team members</li>
                    <li>• View all analytics and reports</li>
                  </>
                )}
                {invite.role === 'editor' && (
                  <>
                    <li>• Create, edit, and delete URLs</li>
                    <li>• View analytics for your URLs</li>
                    <li>• Manage namespaces (if assigned)</li>
                  </>
                )}
                {invite.role === 'viewer' && (
                  <>
                    <li>• View URLs and analytics</li>
                    <li>• Access shared namespaces</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {step === 'register' && (
            <form onSubmit={handleAcceptInvite} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                size="lg"
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                size="lg"
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                showPasswordToggle={true}
                required
                size="lg"
              />
              
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                showPasswordToggle={true}
                required
                size="lg"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Accept Invitation
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <div className="text-center">
              <p className="text-neutral-600 mb-4">
                You need to create an account to accept this invitation.
              </p>
              <Button
                variant="primary"
                onClick={() => setStep('register')}
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Join
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-neutral-500">
            By accepting this invitation, you agree to our{' '}
            <a href="/terms" className="text-brand-orange hover:text-primary-600">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-brand-orange hover:text-primary-600">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteAccept;