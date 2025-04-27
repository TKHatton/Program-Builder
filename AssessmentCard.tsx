// AssessmentCard component for displaying assessment information
'use client';

import React from 'react';
import Link from 'next/link';

interface AssessmentCardProps {
  assessment: {
    id: number;
    title: string;
    description?: string;
    assessmentType: string;
    passingScore?: number;
    timeLimit?: number;
    isPublished: boolean;
  };
  userScore?: {
    score: number;
    isPassing: boolean;
    completedAt: string;
  };
  isInstructor?: boolean;
  className?: string;
}

export default function AssessmentCard({
  assessment,
  userScore,
  isInstructor = false,
  className = '',
}: AssessmentCardProps) {
  // Format assessment type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {assessment.title}
          </h3>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {formatType(assessment.assessmentType)}
            </span>
            {!assessment.isPublished && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Draft
              </span>
            )}
          </div>
        </div>
        
        {assessment.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {assessment.description}
          </p>
        )}
        
        <div className="mt-2 text-sm text-gray-500">
          {assessment.passingScore && (
            <p>Passing score: {assessment.passingScore}%</p>
          )}
          {assessment.timeLimit && (
            <p>Time limit: {assessment.timeLimit} minutes</p>
          )}
        </div>
        
        {userScore && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Your score:</span>
              <span className={`font-semibold ${userScore.isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {userScore.score}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Completed on {new Date(userScore.completedAt).toLocaleDateString()}
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Link
            href={`/assessments/${assessment.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            {userScore ? 'Review Assessment' : 'Take Assessment'}
          </Link>
          
          {isInstructor && (
            <Link
              href={`/assessments/${assessment.id}/edit`}
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
