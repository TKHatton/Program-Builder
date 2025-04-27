// AssessmentForm component for creating and editing assessments
'use client';

import React, { useState } from 'react';

interface AssessmentFormProps {
  initialData?: {
    id?: number;
    courseId: number;
    title: string;
    description: string;
    assessmentType: string;
    passingScore?: number;
    timeLimit?: number;
    isPublished: boolean;
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  className?: string;
}

export default function AssessmentForm({
  initialData = {
    courseId: 0,
    title: '',
    description: '',
    assessmentType: 'quiz',
    passingScore: 70,
    timeLimit: null,
    isPublished: false
  },
  onSubmit,
  isSubmitting = false,
  className = '',
}: AssessmentFormProps) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : null }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Assessment Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter assessment title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe what this assessment covers"
        />
      </div>

      <div>
        <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700">
          Assessment Type *
        </label>
        <select
          id="assessmentType"
          name="assessmentType"
          value={formData.assessmentType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="quiz">Quiz</option>
          <option value="assignment">Assignment</option>
          <option value="project">Project</option>
        </select>
      </div>

      <div>
        <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700">
          Passing Score (%)
        </label>
        <input
          type="number"
          id="passingScore"
          name="passingScore"
          value={formData.passingScore || ''}
          onChange={handleNumberChange}
          min={0}
          max={100}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Minimum score to pass (e.g., 70)"
        />
      </div>

      <div>
        <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
          Time Limit (minutes)
        </label>
        <input
          type="number"
          id="timeLimit"
          name="timeLimit"
          value={formData.timeLimit || ''}
          onChange={handleNumberChange}
          min={1}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Leave blank for no time limit"
        />
      </div>

      <div className="flex items-center">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          checked={formData.isPublished}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
          Publish assessment (make visible to learners)
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Assessment' : 'Create Assessment'}
        </button>
      </div>
    </form>
  );
}
