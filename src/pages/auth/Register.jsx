import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      try {
        console.log('🚀 Attempting registration with:', userData);
        const response = await api.post('/rest-auth/registration/', userData);
        console.log('📥 Registration response:', response);
        console.log('📊 Response status:', response.status);
        console.log('📦 Response data:', response.data);
        console.log('🔍 Data type:', typeof response.data);
        console.log('🔍 Has user?', !!response.data?.user);
        return response.data;
      } catch (error) {
        console.error('💥 Error in mutationFn:', error);
        console.error('💥 Error response:', error.response);
        console.error('💥 Error data:', error.response?.data);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Handle successful registration
      console.log('✅ onSuccess called with data:', data);
      
      if (data && data.user) {
        setUser(data.user);
        toast.success(data.message || 'Account created successfully!');
        
        // Redirect to the page they were trying to access, or dashboard
        navigate(from, { replace: true });
      } else {
        console.error('❌ Success but no user data:', data);
        toast.error('Registration succeeded but user data is missing');
      }
    },
    onError: (error) => {
      console.error('Registration error:', error.response?.data);
      
      const errorData = error.response?.data;
      
      if (errorData) {
        // Check if we have field-specific errors (like {"email": ["error message"]})
        if (typeof errorData === 'object' && !errorData.detail && !errorData.error && !errorData.message) {
          // Field-specific errors
          setErrors(errorData);
          
          // Show a summary toast for field errors
          const firstError = Object.values(errorData)[0];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          toast.error(errorMessage || 'Please check the form for errors');
        } else {
          // General error message
          const message = errorData.detail || errorData.error || errorData.message || 'Registration failed';
          toast.error(message);
          
          // If there are also field errors, set them
          const fieldErrors = { ...errorData };
          delete fieldErrors.detail;
          delete fieldErrors.error;
          delete fieldErrors.message;
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }
        }
      } else {
        toast.error('Registration failed. Please try again.');
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    if (formData.password1 !== formData.password2) {
      setErrors({ password2: ['Passwords do not match'] });
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-info-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-neutral-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Join us and start shortening your links
          </p>
          
          {/* Show message if redirected from a protected route */}
          {location.state?.from && (
            <div className="mt-4 p-3 bg-info-50 border border-info-200 rounded-lg">
              <p className="text-sm text-info-700">
                Create an account to access <strong>{location.state.from.pathname}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-neutral-200" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name?.[0]}
              icon={<User className="w-5 h-5" />}
              placeholder="John Doe"
              required
              autoComplete="name"
              autoFocus
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              icon={<Mail className="w-5 h-5" />}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                error={errors.password1?.[0]}
                icon={<Lock className="w-5 h-5" />}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                error={errors.password2?.[0]}
                icon={<Lock className="w-5 h-5" />}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-xs text-neutral-600 mb-2 font-medium">Password requirements:</p>
            <ul className="text-xs text-neutral-500 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Contains at least one number</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={registerMutation.isPending}
            icon={<UserPlus className="w-5 h-5" />}
          >
            Create account
          </Button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ from: location.state?.from }} // Pass along the intended destination
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
