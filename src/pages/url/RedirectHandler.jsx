import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle, ExternalLink, Link as LinkIcon, Shield, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../api/axios';

const RedirectHandler = () => {
  const { namespace, shortcode } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [urlInfo, setUrlInfo] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [requiresAuth, setRequiresAuth] = useState(false);

  useEffect(() => {
    resolveURL();
  }, [namespace, shortcode]);

  useEffect(() => {
    if (redirectUrl && !requiresAuth) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [redirectUrl, requiresAuth]);

  const resolveURL = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get(`/${namespace}/${shortcode}/`);
      
      if (response.data.original_url) {
        setRedirectUrl(response.data.original_url);
        setUrlInfo(response.data);
        setRequiresAuth(response.data.is_private || false);
      } else {
        setError('URL not found');
      }
    } catch (err) {
      console.error('Error resolving URL:', err);
      if (err.response?.status === 401) {
        setRequiresAuth(true);
        setError('This URL requires authentication');
      } else {
        setError(err.response?.data?.error || 'Failed to resolve URL');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleLogin = () => {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Resolving URL...
          </h2>
          <p className="text-neutral-600">
            Please wait while we find your destination.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {requiresAuth ? (
                <Shield className="w-8 h-8 text-error-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-error-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {requiresAuth ? 'Authentication Required' : 'Link Not Found'}
            </h2>
            <p className="text-neutral-600 mb-6">
              {error}
            </p>
            
            {requiresAuth ? (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={handleLogin}
                  className="w-full"
                >
                  Sign In to Continue
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (redirectUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Redirecting...
            </h2>
            <p className="text-neutral-600 mb-4">
              You are being redirected to:
            </p>
            
            <div className="card mb-6">
              <div className="flex items-center gap-3 mb-3">
                <LinkIcon className="w-5 h-5 text-brand-orange" />
                <span className="text-sm font-medium text-neutral-900">
                  {urlInfo?.title || 'Untitled URL'}
                </span>
              </div>
              <p className="text-sm text-neutral-600 break-all bg-neutral-50 p-3 rounded-lg">
                {redirectUrl}
              </p>
              {urlInfo?.description && (
                <p className="text-xs text-neutral-500 mt-2">
                  {urlInfo.description}
                </p>
              )}
            </div>

            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span className="text-sm font-medium text-brand-gold">
                  Redirecting in {countdown} seconds
                </span>
              </div>
              <div className="w-full bg-brand-gold/20 rounded-full h-2">
                <div 
                  className="bg-brand-gold h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleManualRedirect}
                className="w-full"
                icon={<ExternalLink className="w-4 h-4" />}
              >
                Continue to Destination
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;
