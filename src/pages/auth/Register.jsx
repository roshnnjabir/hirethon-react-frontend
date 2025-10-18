import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Link as LinkIcon, Sparkles, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticState, setOptimisticState] = useState(null);
  const [errors, setErrors] = useState({});
  
  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Clear optimistic state when user starts typing
    if (optimisticState) {
      setOptimisticState(null);
    }
  }, [errors, optimisticState]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setOptimisticState('updating');
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword,
      });
      
      if (result.success) {
        setOptimisticState('success');
        toast.success('Account created successfully! Welcome aboard!');
        
        // Small delay to show optimistic success state
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setOptimisticState('error');
      toast.error('Registration failed. Please try again.');
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
            Create your account
          </h1>
          <p className="text-neutral-600">
            Join the URL Shortener platform
          </p>
        </div>
        
        {/* Registration Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                label="Full name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.name}
                optimistic={true}
                optimisticState={optimisticState}
                size="lg"
              />
              
              <Input
                label="Email address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
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
                error={errors.password}
                showPasswordToggle={true}
                optimistic={true}
                optimisticState={optimisticState}
                size="lg"
              />
              
              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                showPasswordToggle={true}
                optimistic={true}
                optimisticState={optimisticState}
                size="lg"
              />
            </div>

            {error && (
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
              disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="w-full"
            >
              {optimisticState === 'success' ? 'Account Created!' : 'Create Account'}
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <div className="text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-orange hover:text-primary-600 transition-colors"
            >
              Sign in here
            </Link>
          </div>
          
          <div className="text-xs text-neutral-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-brand-orange hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-brand-orange hover:text-primary-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
