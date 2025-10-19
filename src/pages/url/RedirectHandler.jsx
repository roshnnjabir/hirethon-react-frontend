import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const RedirectHandler = () => {
  const { namespace, shortcode } = useParams();

  useEffect(() => {
    const resolveAndRedirect = async () => {
      try {
        // Get URL info and redirect immediately
        const response = await api.get(`/info/${namespace}/${shortcode}/`);
        
        if (response.data.original_url) {
          // Check if URL is private and requires auth
          if (response.data.is_private) {
            // Redirect to login with return URL
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
          }
          
          // Direct redirect to original URL
          window.location.href = response.data.original_url;
        } else {
          // URL not found - redirect to dashboard
          window.location.href = '/dashboard';
        }
      } catch (err) {
        console.error('Error resolving URL:', err);
        
        if (err.response?.status === 401) {
          // Authentication required - redirect to login
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        } else {
          // Error - redirect to dashboard
          window.location.href = '/dashboard';
        }
      }
    };

    resolveAndRedirect();
  }, [namespace, shortcode]);

  // Show minimal loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-neutral-600 text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;