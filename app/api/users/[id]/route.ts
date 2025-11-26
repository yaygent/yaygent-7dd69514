import { NextRequest } from 'next/server';
import { successResponse, responses, errorResponse } from '../../utils/responses';
import { isNonEmptyString, isValidEmail } from '../../utils/validation';

/**
 * In-memory user store (should match the one in /api/users/route.ts)
 * In production, this would be a shared database service
 */
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// This is a simplified example - in production, use a shared data store
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
];

/**
 * GET /api/users/[id]
 * Retrieve a specific user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return responses.badRequest('User ID is required');
    }

    const user = users.find((u) => u.id === id);

    if (!user) {
      return responses.notFound('User not found');
    }

    return successResponse(user);
  } catch (error) {
    return responses.internalServerError(
      error instanceof Error ? error.message : 'Failed to retrieve user'
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update a user by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return responses.badRequest('User ID is required');
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return responses.notFound('User not found');
    }

    const body = await request.json();
    const updates: Partial<User> = {};

    // Validate and update name if provided
    if (body.name !== undefined) {
      updates.name = isNonEmptyString(body.name, 'name');
    }

    // Validate and update email if provided
    if (body.email !== undefined) {
      const email = isValidEmail(body.email, 'email');
      // Check if email is already taken by another user
      if (users.some((u) => u.email === email && u.id !== id)) {
        return responses.conflict('Email is already taken by another user');
      }
      updates.email = email;
    }

    // Update user
    const updatedUser: User = {
      ...users[userIndex],
      ...updates,
    };

    users[userIndex] = updatedUser;

    return successResponse(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return responses.badRequest(error.message);
    }
    return responses.internalServerError('Failed to update user');
  }
}

/**
 * PATCH /api/users/[id]
 * Partially update a user by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // PATCH works the same as PUT in this implementation
  return PUT(request, { params });
}

/**
 * DELETE /api/users/[id]
 * Delete a user by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return responses.badRequest('User ID is required');
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return responses.notFound('User not found');
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    return successResponse(
      { message: 'User deleted successfully', user: deletedUser },
      200
    );
  } catch (error) {
    return responses.internalServerError(
      error instanceof Error ? error.message : 'Failed to delete user'
    );
  }
}
