// Leaderboard component for displaying top users
'use client';

import React from 'react';
import PointsDisplay from './PointsDisplay';

interface LeaderboardUser {
  id: number;
  username: string;
  fullName?: string;
  totalPoints: number;
  badgeCount: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: number;
  className?: string;
}

export default function Leaderboard({
  users,
  currentUserId,
  className = '',
}: LeaderboardProps) {
  return (
    <div className={`w-full rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-indigo-600 text-white px-4 py-3 font-semibold">
        Leaderboard
      </div>
      
      <div className="divide-y divide-gray-200">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No data available
          </div>
        ) : (
          users.map((user, index) => (
            <div 
              key={user.id}
              className={`flex items-center p-3 ${
                user.id === currentUserId ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 text-center font-bold text-gray-500">
                {index + 1}
              </div>
              
              <div className="flex-grow ml-3">
                <div className="font-medium">
                  {user.fullName || user.username}
                </div>
                <div className="text-sm text-gray-500">
                  {user.badgeCount} badge{user.badgeCount !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <PointsDisplay points={user.totalPoints} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
