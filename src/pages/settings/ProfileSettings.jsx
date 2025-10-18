import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Lock, 
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/auth/profile/');
      return response.data;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/auth/profile/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile']);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/auth/change_password/', data);
      return response.data;
    },
    onSuccess: () => {
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowPasswordForm(false);
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to change password');
    },
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    
    changePasswordMutation.mutate({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (profileLoading) {
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
              <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
              <p className="text-neutral-600">Manage your account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  icon={<User className="w-4 h-4" />}
                  iconPosition="left"
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  icon={<Mail className="w-4 h-4" />}
                  iconPosition="left"
                  disabled
                />
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">
                    Email address cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={updateProfileMutation.isPending}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </form>
            </div>

            {/* Password Change */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Password & Security</h2>
                {!showPasswordForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordForm(true)}
                    icon={<Lock className="w-4 h-4" />}
                  >
                    Change Password
                  </Button>
                )}
              </div>
              
              {showPasswordForm ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    placeholder="Enter your current password"
                    icon={<Lock className="w-4 h-4" />}
                    iconPosition="left"
                    showPasswordToggle={true}
                    required
                  />
                  
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    placeholder="Enter your new password"
                    icon={<Lock className="w-4 h-4" />}
                    iconPosition="left"
                    showPasswordToggle={true}
                    required
                  />
                  
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    placeholder="Confirm your new password"
                    icon={<Lock className="w-4 h-4" />}
                    iconPosition="left"
                    showPasswordToggle={true}
                    required
                  />

                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      <li className="flex items-center gap-2">
                        {passwordData.new_password.length >= 8 ? (
                          <Check className="w-3 h-3 text-brand-gold" />
                        ) : (
                          <X className="w-3 h-3 text-neutral-400" />
                        )}
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordData.new_password === passwordData.confirm_password && passwordData.new_password ? (
                          <Check className="w-3 h-3 text-brand-gold" />
                        ) : (
                          <X className="w-3 h-3 text-neutral-400" />
                        )}
                        Passwords match
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          confirm_password: ''
                        });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={changePasswordMutation.isPending}
                      disabled={
                        !passwordData.current_password ||
                        !passwordData.new_password ||
                        !passwordData.confirm_password ||
                        passwordData.new_password !== passwordData.confirm_password ||
                        passwordData.new_password.length < 8
                      }
                      className="flex-1"
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-4">
                    Keep your account secure with a strong password
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">User ID:</span>
                  <span className="font-mono text-neutral-900">{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Member since:</span>
                  <span className="text-neutral-900">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Last login:</span>
                  <span className="text-neutral-900">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-brand-crimson/20">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Sign Out
                </Button>
                <div className="bg-error-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-error-700 mb-2">Delete Account</h4>
                  <p className="text-xs text-error-600 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Delete Account (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
