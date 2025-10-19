import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * RedirectHandler - Handles short URL redirects by immediately redirecting to backend
 * 
 * This component doesn't render anything - it just redirects to the backend API
 * The backend handles:
 * - Public URLs: Immediate redirect to destination
 * - Private URLs (not logged in): Stores session + redirects to frontend /login
 * - Private URLs (logged in, has access): Immediate redirect to destination  
 * - Private URLs (logged in, no access): Redirects to frontend with error message
 */
const RedirectHandler = () => {
  const { namespace, shortcode } = useParams();

  useEffect(() => {
    // Construct the backend API URL
    const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/${namespace}/${shortcode}/`;
    
    console.log('Redirecting to backend:', backendUrl);
    
    // Immediately redirect to backend - let it handle everything
    // This is a full page redirect, so:
    // - No CORS issues
    // - Session cookies are included
    // - Backend can do HTTP redirects or return HTML error pages
    window.location.href = backendUrl;
  }, [namespace, shortcode]);

  // Show minimal loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600 text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;
