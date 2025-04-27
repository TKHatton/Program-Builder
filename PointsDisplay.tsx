// Points display component for showing user points
'use client';

import React from 'react';

interface PointsDisplayProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function PointsDisplay({
  points,
  size = 'md',
  showLabel = true,
  className = '',
}: PointsDisplayProps) {
  // Size mapping
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const textSize = sizeMap[size];

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`font-bold ${textSize} text-indigo-600`}>
        {points.toLocaleString()}
      </div>
      {showLabel && (
        <div className={`ml-1 ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm'} text-gray-600`}>
          points
        </div>
      )}
    </div>
  );
}
