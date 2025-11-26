'use client';

import { useState, useEffect } from 'react';
import type { Image } from '@/types/image';
import { getImages, uploadImage, deleteImage } from '@/lib/api/images';
import ImageUpload from '@/components/gallery/ImageUpload';
import ImageGallery from '@/components/gallery/ImageGallery';

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });

  // Load images
  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getImages(pagination.limit, pagination.offset);
      if (response.success && response.data) {
        setImages(response.data.images);
      } else {
        setError(response.error?.message || 'Failed to load images');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.limit, pagination.offset]);

  // Handle image upload
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await uploadImage(file);
      if (response.success) {
        setSuccessMessage('Image uploaded successfully!');
        await loadImages();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error?.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await deleteImage(id);
      if (response.success) {
        setSuccessMessage('Image deleted successfully!');
        await loadImages();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error?.message || 'Failed to delete image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Gallery</h1>
          <p className="text-gray-600">Upload and manage your images</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-8 bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
          <ImageUpload onUpload={handleUpload} isLoading={isUploading} />
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
          <ImageGallery
            images={images}
            onDelete={handleDelete}
            isLoading={isLoading || isDeleting}
          />
        </div>

        {/* Pagination Controls */}
        {images.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    offset: Math.max(0, prev.offset - prev.limit),
                  }))
                }
                disabled={pagination.offset === 0 || isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    offset: prev.offset + prev.limit,
                  }))
                }
                disabled={images.length < pagination.limit || isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {pagination.offset + 1}-
              {pagination.offset + images.length} of images
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
