import { NextRequest } from 'next/server';
import { successResponse, responses, errorResponse } from '../utils/responses';
import { validateRequestBody, isNonEmptyString, isValidEmail } from '../utils/validation';

/**
 * In-memory user store (replace with database in production)
 */
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
];

/**
 * GET /api/users
 * Retrieve all users
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let result = users;

    // Simple pagination
    if (offset || limit) {
      const start = offset ? parseInt(offset, 10) : 0;
      const end = limit ? start + parseInt(limit, 10) : undefined;
      result = users.slice(start, end);
    }

    return successResponse(
      {
        users: result,
        total: users.length,
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
      error instanceof Error ? error.message : 'Failed to retrieve users'
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validated = validateRequestBody(body, ['name', 'email']);
    const name = isNonEmptyString(validated.name, 'name');
    const email = isValidEmail(validated.email, 'email');

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return responses.conflict('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: String(users.length + 1),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return responses.created(newUser);
  } catch (error) {
    if (error instanceof Error) {
      return responses.badRequest(error.message);
    }
    return responses.internalServerError('Failed to create user');
  }
}
