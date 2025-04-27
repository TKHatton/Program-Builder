// Badge component for displaying user badges
'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/lib/types';

interface BadgeComponentProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  showDescription?: boolean;
}

export default function BadgeComponent({
  badge,
  size = 'md',
  showTitle = true,
  showDescription = false,
}: BadgeComponentProps) {
  // Size mapping
  const sizeMap = {
    sm: 40,
    md: 80,
    lg: 120,
  };

  const badgeSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative rounded-full overflow-hidden border-2 border-yellow-400 ${
          size === 'sm' ? 'p-1' : size === 'md' ? 'p-2' : 'p-3'
        }`}
      >
        {badge.imageUrl ? (
          <Image
            src={badge.imageUrl}
            alt={badge.title}
            width={badgeSize}
            height={badgeSize}
            className="rounded-full"
          />
        ) : (
          <div 
            className={`flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full text-white font-bold`}
            style={{ width: badgeSize, height: badgeSize }}
          >
            {badge.title.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      
      {showTitle && (
        <div className="mt-2 text-center font-medium">
          {badge.title}
        </div>
      )}
      
      {showDescription && badge.description && (
        <div className="mt-1 text-center text-sm text-gray-600">
          {badge.description}
        </div>
      )}
    </div>
  );
}
