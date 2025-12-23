import React from 'react';

/**
 * Reusable loading skeletons for better perceived performance
 */

export function SectionSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-12 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center space-y-4 mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse" />
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
}
