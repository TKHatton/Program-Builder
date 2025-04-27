// Badge Collection component for displaying a user's badges
'use client';

import React from 'react';
import Badge from './Badge';
import { Badge as BadgeType } from '@/lib/types';

interface BadgeCollectionProps {
  badges: BadgeType[];
  emptyMessage?: string;
  showDescriptions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BadgeCollection({
  badges,
  emptyMessage = 'No badges earned yet',
  showDescriptions = false,
  size = 'md',
  className = '',
}: BadgeCollectionProps) {
  if (badges.length === 0) {
    return (
      <div className={`text-center p-4 text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      {badges.map((badge) => (
        <Badge
          key={badge.id}
          badge={badge}
          size={size}
          showTitle={true}
          showDescription={showDescriptions}
        />
      ))}
    </div>
  );
}
