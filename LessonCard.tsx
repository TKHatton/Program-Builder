// LessonCard component for displaying lesson information
'use client';

import React from 'react';
import Link from 'next/link';

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    description?: string;
    estimatedDuration?: number;
    isPublished: boolean;
  };
  isCompleted?: boolean;
  isInstructor?: boolean;
  className?: string;
}

export default function LessonCard({
  lesson,
  isCompleted = false,
  isInstructor = false,
  className = '',
}: LessonCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
            {isCompleted && (
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {lesson.title}
          </h3>
          {!lesson.isPublished && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
        </div>
        
        {lesson.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {lesson.description}
          </p>
        )}
        
        {lesson.estimatedDuration && (
          <div className="mt-2 text-sm text-gray-500">
            <p>Estimated duration: {lesson.estimatedDuration} minutes</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Link
            href={`/lessons/${lesson.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            {isCompleted ? 'Review Lesson' : 'Start Lesson'}
          </Link>
          
          {isInstructor && (
            <Link
              href={`/lessons/${lesson.id}/edit`}
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
