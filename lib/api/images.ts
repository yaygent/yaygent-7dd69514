import type { ApiResponse } from '@/types/user';
import type { Image, ImagesListResponse } from '@/types/image';

const API_BASE_URL = '/api';

/**
 * Fetches all images with optional pagination
 */
export async function getImages(
  limit?: number,
  offset?: number
): Promise<ApiResponse<ImagesListResponse>> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());

  const url = `${API_BASE_URL}/images${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url);
  return response.json();
}

/**
 * Uploads a new image
 */
export async function uploadImage(file: File): Promise<ApiResponse<Image>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/images`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

/**
 * Deletes an image by ID
 */
export async function deleteImage(id: string): Promise<ApiResponse<{ message: string; image: Image }>> {
  const response = await fetch(`${API_BASE_URL}/images/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
