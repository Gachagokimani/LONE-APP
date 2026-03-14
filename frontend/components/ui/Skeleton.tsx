import React from 'react';

interface SkeletonProps {
  count?: number;
  height?: string;
  circle?: boolean;
  className?: string;
}

export default function Skeleton({ count = 1, height = '1rem', circle = false, className = '' }: SkeletonProps) {
  const skeletonClass = `skeleton ${circle ? 'skeleton-avatar' : 'skeleton-text'} ${className}`.trim();
  
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={skeletonClass}
          style={!circle ? { height } : {}}
        />
      ))}
    </div>
  );
}
