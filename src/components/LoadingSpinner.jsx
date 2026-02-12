import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'green' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 