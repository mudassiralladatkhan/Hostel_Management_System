import React from 'react';

const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} />
  );
};

export default SkeletonLoader;
