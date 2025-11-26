import { NextRequest } from 'next/server';
import { successResponse } from './utils/responses';

/**
 * Root API endpoint
 * GET /api
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  
  return successResponse(
    {
      name: 'API',
      version: '1.0.0',
      status: 'operational',
      endpoints: {
        root: `${baseUrl}/api`,
        users: `${baseUrl}/api/users`,
        userById: `${baseUrl}/api/users/[id]`,
      },
      documentation: {
        description: 'RESTful API for managing resources',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      },
    },
    200,
    {
      path: '/api',
    }
  );
}
