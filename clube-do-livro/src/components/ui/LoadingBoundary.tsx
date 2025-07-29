import React, { ReactNode, Suspense } from 'react';
import PageLoader from './PageLoader';
import SkeletonLoader, { CardSkeleton, PostSkeleton, TableSkeleton } from './SkeletonLoader';

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'page' | 'card' | 'post' | 'table' | 'custom';
  customLoader?: ReactNode;
}

const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  children,
  fallback,
  variant = 'page',
  customLoader
}) => {
  const getLoader = () => {
    if (fallback) return fallback;
    if (customLoader) return customLoader;

    switch (variant) {
      case 'card':
        return <CardSkeleton />;
      case 'post':
        return <PostSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'page':
      default:
        return <PageLoader />;
    }
  };

  return (
    <Suspense fallback={getLoader()}>
      {children}
    </Suspense>
  );
};

export default LoadingBoundary;