// EnhancementMaterialForm component for creating and editing enhancement materials
'use client';

import React, { useState } from 'react';

interface EnhancementMaterialFormProps {
  initialData?: {
    id?: number;
    programId: number;
    title: string;
    description: string;
    materialType: string;
    contentUrl?: string;
    contentText?: string;
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  className?: string;
}

export default function EnhancementMaterialForm({
  initialData = {
    programId: 0,
    title: '',
    description: '',
    materialType: 'document',
    contentUrl: '',
    contentText: ''
  },
  onSubmit,
  isSubmitting = false,
  className = '',
}: EnhancementMaterialFormProps) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Material Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter material title"
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
          placeholder="Brief description of this material"
        />
      </div>

      <div>
        <label htmlFor="materialType" className="block text-sm font-medium text-gray-700">
          Material Type *
        </label>
        <select
          id="materialType"
          name="materialType"
          value={formData.materialType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="link">External Link</option>
          <option value="image">Image</option>
        </select>
      </div>

      {(formData.materialType === 'link' || formData.materialType === 'video' || formData.materialType === 'image') && (
        <div>
          <label htmlFor="contentUrl" className="block text-sm font-medium text-gray-700">
            Content URL *
          </label>
          <input
            type="url"
            id="contentUrl"
            name="contentUrl"
            value={formData.contentUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://example.com/resource"
          />
        </div>
      )}

      {formData.materialType === 'document' && (
        <div>
          <label htmlFor="contentText" className="block text-sm font-medium text-gray-700">
            Content Text *
          </label>
          <textarea
            id="contentText"
            name="contentText"
            value={formData.contentText}
            onChange={handleChange}
            required
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter the document content here (supports Markdown)"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Material' : 'Create Material'}
        </button>
      </div>
    </form>
  );
}
