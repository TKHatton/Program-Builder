// CourseForm component for creating and editing courses
'use client';

import React, { useState } from 'react';

interface CourseFormProps {
  initialData?: {
    id?: number;
    programId: number;
    title: string;
    description: string;
    sequenceOrder: number;
    isPublished: boolean;
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  className?: string;
}

export default function CourseForm({
  initialData = {
    programId: 0,
    title: '',
    description: '',
    sequenceOrder: 1,
    isPublished: false
  },
  onSubmit,
  isSubmitting = false,
  className = '',
}: CourseFormProps) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
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
          Course Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter course title"
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
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe what this course covers"
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
          placeholder="Order in the program sequence"
        />
        <p className="mt-1 text-sm text-gray-500">
          This determines the order in which courses appear in the program.
        </p>
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
          Publish course (make visible to learners)
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
