import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Get message from query params (e.g., ?message=...)
  const queryMessage = searchParams.get('message');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login/', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Handle successful login
      console.log('Login successful:', data);
      
      if (data.user) {
        setUser(data.user);
        toast.success(data.message || 'Welcome back!');
        
        // Check if backend provided a redirect URL (for private short URLs)
        if (data.redirect_to) {
          console.log('Redirecting to backend-specified URL:', data.redirect_to);
          window.location.href = data.redirect_to;
          return;
        }
        
        // Otherwise, redirect to the page they were trying to access from frontend state
        navigate(from, { replace: true });
      } else {
        toast.error('Login succeeded but user data is missing');
      }
    },
    onError: (error) => {
      console.error('Login error:', error.response?.data);
      
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
          const message = errorData.detail || errorData.error || errorData.message || 'Invalid credentials';
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
        toast.error('Login failed. Please try again.');
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
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-info-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-neutral-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in to your account to continue
          </p>
          
          {/* Show message if redirected from a protected route or private URL */}
          {(location.state?.from || queryMessage) && (
            <div className="mt-4 p-3 bg-info-50 border border-info-200 rounded-lg">
              <p className="text-sm text-info-700">
                {queryMessage || location.state?.message || (
                  <>
                    Please sign in to access <strong>{location.state?.from?.pathname}</strong>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-neutral-200" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              autoFocus
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password?.[0]}
                icon={<Lock className="w-5 h-5" />}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
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
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={loginMutation.isPending}
            icon={<LogIn className="w-5 h-5" />}
          >
            Sign in
          </Button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                state={{ from: location.state?.from }} // Pass along the intended destination
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
