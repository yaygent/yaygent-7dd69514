/**
 * User type definition matching the API schema
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/**
 * API response wrapper type
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
    pagination?: {
      limit?: number;
      offset?: number;
    };
  };
}

/**
 * Users list response data structure
 */
export interface UsersListResponse {
  users: User[];
  total: number;
  count: number;
}

/**
 * User form data for create/update operations
 */
export interface UserFormData {
  name: string;
  email: string;
}

/**
 * Form validation errors
 */
export interface FormErrors {
  name?: string;
  email?: string;
  general?: string;
}
