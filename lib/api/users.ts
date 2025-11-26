import type { ApiResponse, User, UsersListResponse, UserFormData } from '@/types/user';

const API_BASE_URL = '/api';

/**
 * Fetches all users with optional pagination
 */
export async function getUsers(
  limit?: number,
  offset?: number
): Promise<ApiResponse<UsersListResponse>> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());

  const url = `${API_BASE_URL}/users${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url);
  return response.json();
}

/**
 * Fetches a single user by ID
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return response.json();
}

/**
 * Creates a new user
 */
export async function createUser(data: UserFormData): Promise<ApiResponse<User>> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Updates a user (full update)
 */
export async function updateUser(
  id: string,
  data: UserFormData
): Promise<ApiResponse<User>> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Partially updates a user
 */
export async function patchUser(
  id: string,
  data: Partial<UserFormData>
): Promise<ApiResponse<User>> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Deletes a user
 */
export async function deleteUser(id: string): Promise<ApiResponse<{ message: string; user: User }>> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
