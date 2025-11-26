/**
 * Image type definition matching the API schema
 */
export interface Image {
  id: string;
  filename: string;
  url: string;
  size: number;
  width: number;
  height: number;
  uploadedAt: string;
}

/**
 * Images list response data structure
 */
export interface ImagesListResponse {
  images: Image[];
  total: number;
  count: number;
}

/**
 * Image upload form data
 */
export interface ImageUploadData {
  file: File;
}

/**
 * Form validation errors for image upload
 */
export interface ImageFormErrors {
  file?: string;
  general?: string;
}
