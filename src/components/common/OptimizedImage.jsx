import React, { useState, useEffect, useRef } from 'react';

/**
 * Optimized image component with lazy loading and blur placeholder
 * Improves performance by loading images only when visible
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = 'blur',
  aspectRatio,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Aspect ratio container
  const aspectRatioStyle = aspectRatio
    ? { paddingBottom: `${(1 / aspectRatio) * 100}%` }
    : {};

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={aspectRatioStyle}
    >
      {/* Placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`
            ${aspectRatio ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-full'}
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

/**
 * Avatar component with optimized loading
 */
export const Avatar = ({ src, alt, size = 'md', fallback }) => {
  const [error, setError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  // Show fallback if no src or error
  if (!src || error) {
    return (
      <div className={`
        ${sizes[size]} rounded-full
        bg-primary-100 text-primary-700
        flex items-center justify-center
        font-semibold uppercase
      `}>
        {fallback || alt?.charAt(0) || '?'}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover`}
      onError={() => setError(true)}
      aspectRatio={1}
    />
  );
};

/**
 * QR Code image with optimization
 */
export const QRImage = ({ data, size = 200, className = '' }) => {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Generate QR code URL (placeholder - integrate with your QR library)
    const url = `/api/qr?data=${encodeURIComponent(data)}&size=${size}`;
    setQrUrl(url);
  }, [data, size]);

  if (!qrUrl) return <div className={`${className} animate-pulse bg-neutral-200`} />;

  return (
    <OptimizedImage
      src={qrUrl}
      alt="QR Code"
      className={className}
      aspectRatio={1}
    />
  );
};

export default OptimizedImage;

