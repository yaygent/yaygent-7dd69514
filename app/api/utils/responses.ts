import { NextResponse } from 'next/server';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    timestamp: string;
    path?: string;
  };
}

/**
 * Creates a successful JSON response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, unknown>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

/**
 * Creates an error JSON response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Common HTTP error responses
 */
export const responses = {
  badRequest: (message: string = 'Bad Request') =>
    errorResponse(message, 400, 'BAD_REQUEST'),
  
  unauthorized: (message: string = 'Unauthorized') =>
    errorResponse(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') =>
    errorResponse(message, 403, 'FORBIDDEN'),
  
  notFound: (message: string = 'Not Found') =>
    errorResponse(message, 404, 'NOT_FOUND'),
  
  conflict: (message: string = 'Conflict') =>
    errorResponse(message, 409, 'CONFLICT'),
  
  internalServerError: (message: string = 'Internal Server Error') =>
    errorResponse(message, 500, 'INTERNAL_SERVER_ERROR'),
  
  created: <T>(data: T) => successResponse(data, 201),
  ok: <T>(data: T) => successResponse(data, 200),
  noContent: () => new NextResponse(null, { status: 204 }),
};
