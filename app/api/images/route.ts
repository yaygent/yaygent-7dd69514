import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { successResponse, responses } from '../utils/responses';
import { imageStore, type Image } from './store';

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Generate unique filename
 */
function generateFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}${ext}`;
}

/**
 * Sanitize filename to prevent path traversal
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * GET /api/images
 * Retrieve all images with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const allImages = imageStore.getAll();
    let result = allImages;

    // Simple pagination
    if (offset || limit) {
      const start = offset ? parseInt(offset, 10) : 0;
      const end = limit ? start + parseInt(limit, 10) : undefined;
      result = allImages.slice(start, end);
    }

    return successResponse(
      {
        images: result,
        total: allImages.length,
        count: result.length,
      },
      200,
      {
        pagination: {
          limit: limit ? parseInt(limit, 10) : undefined,
          offset: offset ? parseInt(offset, 10) : undefined,
        },
      }
    );
  } catch (error) {
    return responses.internalServerError(
      error instanceof Error ? error.message : 'Failed to retrieve images'
    );
  }
}

/**
 * POST /api/images
 * Upload a new image
 */
export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return responses.badRequest('No file provided');
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return responses.badRequest(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return responses.badRequest(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Generate unique filename
    const originalFilename = sanitizeFilename(file.name);
    const filename = generateFilename(originalFilename);
    const filePath = path.join(UPLOAD_DIR, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get image metadata using sharp
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Validate dimensions
    if (width === 0 || height === 0) {
      return responses.badRequest('Invalid image dimensions');
    }

    // Save file to disk
    await writeFile(filePath, buffer);

    // Create image record
    const imageId = String(imageStore.getCount() + 1);
    const imageUrl = `/uploads/images/${filename}`;
    const newImage: Image = {
      id: imageId,
      filename,
      url: imageUrl,
      size: file.size,
      width,
      height,
      uploadedAt: new Date().toISOString(),
    };

    imageStore.add(newImage);

    return responses.created(newImage);
  } catch (error) {
    console.error('Image upload error:', error);
    return responses.internalServerError(
      error instanceof Error ? error.message : 'Failed to upload image'
    );
  }
}
