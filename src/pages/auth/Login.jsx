import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Building2, Link as LinkIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticState, setOptimisticState] = useState(null);
  
  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear optimistic state when user starts typing
    if (optimisticState) {
      setOptimisticState(null);
    }
  }, [optimisticState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOptimisticState('updating');
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setOptimisticState('success');
        toast.success('Welcome back! Redirecting...');
        
        // Small delay to show optimistic success state
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setOptimisticState('error');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
      // Clear optimistic state after a delay
      setTimeout(() => {
        setOptimisticState(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back
          </h1>
          <p className="text-neutral-600">
            Sign in to your URL Shortener account
          </p>
        </div>
        
        {/* Login Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                label="Email address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={error && error.includes('email') ? error : null}
                optimistic={true}
                optimisticState={optimisticState}
                size="lg"
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={error && error.includes('password') ? error : null}
                showPasswordToggle={true}
                optimistic={true}
                optimisticState={optimisticState}
                size="lg"
              />
            </div>

            {error && !error.includes('email') && !error.includes('password') && (
              <div className="status-error">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              optimistic={true}
              optimisticState={optimisticState}
              disabled={!formData.email || !formData.password}
              className="w-full"
            >
              {optimisticState === 'success' ? 'Success!' : 'Sign in'}
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <Link
            to="/forgot-password"
            className="text-sm text-brand-orange hover:text-primary-600 transition-colors font-medium"
          >
            Forgot your password?
          </Link>
          
          <div className="text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-brand-orange hover:text-primary-600 transition-colors"
            >
              Create one now
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Demo Credentials</h3>
          <div className="text-xs text-neutral-600 space-y-1">
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
