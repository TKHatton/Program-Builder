// Progress Bar component for showing completion progress
'use client';

import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export default function ProgressBar({
  value,
  showPercentage = true,
  height = 'md',
  color = 'primary',
  className = '',
}: ProgressBarProps) {
  // Ensure value is between 0-100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Height mapping
  const heightMap = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };
  
  // Color mapping
  const colorMap = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };
  
  const barHeight = heightMap[height];
  const barColor = colorMap[color];

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${barHeight} bg-gray-200 rounded-full overflow-hidden`}>
        <div 
          className={`${barColor} ${barHeight} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {normalizedValue.toFixed(0)}%
        </div>
      )}
    </div>
  );
}
