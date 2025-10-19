import React from 'react';

/**
 * Skeleton loading component for better perceived performance
 * Shows placeholder content while data is loading
 */
const Skeleton = ({ 
  variant = 'text', 
  width = 'w-full', 
  height = 'h-4',
  className = '',
  count = 1,
  rounded = 'rounded'
}) => {
  const variants = {
    text: `${height} ${width} ${rounded}`,
    circle: `${height} ${height} rounded-full`,
    rectangle: `${height} ${width} ${rounded}`,
    card: 'h-48 w-full rounded-xl',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };

  const baseClass = 'animate-pulse bg-neutral-200';
  const skeletonClass = `${baseClass} ${variants[variant]} ${className}`;

  if (count === 1) {
    return <div className={skeletonClass} />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </div>
  );
};

// Pre-built skeleton patterns
export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-neutral-200 p-6">
    <div className="flex items-start gap-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-3">
        <Skeleton width="w-2/3" height="h-5" />
        <Skeleton width="w-full" height="h-4" count={2} />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
    {/* Header */}
    <div className="border-b border-neutral-200 p-4">
      <div className="flex gap-4">
        <Skeleton width="w-32" height="h-5" />
        <Skeleton width="w-48" height="h-5" />
        <Skeleton width="w-24" height="h-5" />
      </div>
    </div>
    {/* Rows */}
    <div className="divide-y divide-neutral-200">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circle" height="h-8" />
            <Skeleton width="w-32" height="h-4" />
            <Skeleton width="w-48" height="h-4" />
            <Skeleton width="w-24" height="h-4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl border border-neutral-200 p-6">
        <Skeleton width="w-20" height="h-4" className="mb-3" />
        <Skeleton width="w-32" height="h-8" className="mb-2" />
        <Skeleton width="w-24" height="h-3" />
      </div>
    ))}
  </div>
);

export const SkeletonPage = () => (
  <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="mb-8">
      <Skeleton width="w-64" height="h-8" className="mb-2" />
      <Skeleton width="w-96" height="h-5" />
    </div>
    
    {/* Stats */}
    <SkeletonStats />
    
    {/* Content */}
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default Skeleton;

