// LessonForm component for creating and editing lessons
'use client';

import React, { useState } from 'react';

interface LessonFormProps {
  initialData?: {
    id?: number;
    courseId: number;
    title: string;
    description: string;
    content: string;
    sequenceOrder: number;
    estimatedDuration?: number;
    isPublished: boolean;
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  className?: string;
}

export default function LessonForm({
  initialData = {
    courseId: 0,
    title: '',
    description: '',
    content: '',
    sequenceOrder: 1,
    estimatedDuration: null,
    isPublished: false
  },
  onSubmit,
  isSubmitting = false,
  className = '',
}: LessonFormProps) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          Lesson Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter lesson title"
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
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Brief description of this lesson"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Lesson Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter the lesson content here (supports Markdown)"
        />
      </div>

      <div>
        <label htmlFor="sequenceOrder" className="block text-sm font-medium text-gray-700">
          Sequence Order
        </label>
        <input
          type="number"
          id="sequenceOrder"
          name="sequenceOrder"
          value={formData.sequenceOrder}
          onChange={handleNumberChange}
          min={1}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Order in the course sequence"
        />
        <p className="mt-1 text-sm text-gray-500">
          This determines the order in which lessons appear in the course.
        </p>
      </div>

      <div>
        <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
          Estimated Duration (minutes)
        </label>
        <input
          type="number"
          id="estimatedDuration"
          name="estimatedDuration"
          value={formData.estimatedDuration || ''}
          onChange={handleNumberChange}
          min={1}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Approximate time to complete this lesson"
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
          Publish lesson (make visible to learners)
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </div>
    </form>
  );
}
