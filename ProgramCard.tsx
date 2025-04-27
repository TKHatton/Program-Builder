// Program Card component for displaying program information
'use client';

import React from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';

interface ProgramCardProps {
  program: {
    id: number;
    title: string;
    description?: string;
    isPublished: boolean;
  };
  progress?: {
    completedCourses: number;
    totalCourses: number;
    completionPercentage: number;
  };
  isCreator?: boolean;
  className?: string;
}

export default function ProgramCard({
  program,
  progress,
  isCreator = false,
  className = '',
}: ProgramCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {program.title}
          </h3>
          {!program.isPublished && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
        </div>
        
        {program.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {program.description}
          </p>
        )}
        
        {progress && (
          <div className="mt-2 mb-4">
            <ProgressBar value={progress.completionPercentage} />
            <p className="text-xs text-gray-500 mt-1">
              {progress.completedCourses} of {progress.totalCourses} courses completed
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Link
            href={`/programs/${program.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            {progress ? 'Continue Learning' : 'View Program'}
          </Link>
          
          {isCreator && (
            <Link
              href={`/programs/${program.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
