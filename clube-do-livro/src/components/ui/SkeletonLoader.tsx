import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%')
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Carregando..."
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <SkeletonLoader variant="circular" width={40} height={40} />
      <SkeletonLoader variant="text" width={80} height={16} />
    </div>
    <SkeletonLoader variant="text" className="mb-2" />
    <SkeletonLoader variant="text" width="60%" />
    <div className="mt-4">
      <SkeletonLoader variant="rectangular" height={8} className="rounded-full" />
    </div>
  </div>
);

// Post Skeleton
export const PostSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-start gap-4 mb-4">
      <SkeletonLoader variant="circular" width={48} height={48} />
      <div className="flex-1">
        <SkeletonLoader variant="text" width={120} height={20} className="mb-2" />
        <SkeletonLoader variant="text" width={200} height={16} />
      </div>
    </div>
    <SkeletonLoader variant="text" className="mb-2" />
    <SkeletonLoader variant="text" className="mb-2" />
    <SkeletonLoader variant="text" width="80%" />
    <div className="flex items-center gap-6 mt-4 pt-4 border-t">
      <SkeletonLoader variant="text" width={60} height={16} />
      <SkeletonLoader variant="text" width={80} height={16} />
      <SkeletonLoader variant="text" width={100} height={16} />
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="overflow-hidden">
    <table className="min-w-full">
      <thead>
        <tr className="border-b">
          <th className="px-6 py-3">
            <SkeletonLoader variant="text" width={100} height={16} />
          </th>
          <th className="px-6 py-3">
            <SkeletonLoader variant="text" width={150} height={16} />
          </th>
          <th className="px-6 py-3">
            <SkeletonLoader variant="text" width={120} height={16} />
          </th>
          <th className="px-6 py-3">
            <SkeletonLoader variant="text" width={80} height={16} />
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <tr key={index} className="border-b">
            <td className="px-6 py-4">
              <SkeletonLoader variant="text" />
            </td>
            <td className="px-6 py-4">
              <SkeletonLoader variant="text" />
            </td>
            <td className="px-6 py-4">
              <SkeletonLoader variant="text" />
            </td>
            <td className="px-6 py-4">
              <SkeletonLoader variant="rounded" width={80} height={32} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SkeletonLoader;