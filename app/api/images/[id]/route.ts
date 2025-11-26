import { NextRequest } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { responses } from '../../utils/responses';
import { imageStore } from '../store';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');

/**
 * DELETE /api/images/[id]
 * Delete an image by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find image in store
    const image = imageStore.getById(id);

    if (!image) {
      return responses.notFound('Image not found');
    }

    const filePath = path.join(UPLOAD_DIR, image.filename);

    // Delete file from filesystem
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Remove from store
    imageStore.remove(id);

    return responses.ok({ message: 'Image deleted successfully', image });
  } catch (error) {
    console.error('Image deletion error:', error);
    return responses.internalServerError(
      error instanceof Error ? error.message : 'Failed to delete image'
    );
  }
}
