/**
 * Validation utilities for API request handling
 */

/**
 * Validates that a value is not null or undefined
 */
export function isRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} is required`);
  }
  return value;
}

/**
 * Validates that a string is not empty
 */
export function isNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return value.trim();
}

/**
 * Validates that a value is a valid email format
 */
export function isValidEmail(value: unknown, fieldName: string = 'email'): string {
  const email = isNonEmptyString(value, fieldName);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`${fieldName} must be a valid email address`);
  }
  return email;
}

/**
 * Validates that a value is a number
 */
export function isNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a number`);
  }
  return value;
}

/**
 * Validates that a number is within a range
 */
export function isNumberInRange(
  value: unknown,
  min: number,
  max: number,
  fieldName: string
): number {
  const num = isNumber(value, fieldName);
  if (num < min || num > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return num;
}

/**
 * Validates that a value is a valid UUID
 */
export function isValidUUID(value: unknown, fieldName: string = 'id'): string {
  const uuid = isNonEmptyString(value, fieldName);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    throw new Error(`${fieldName} must be a valid UUID`);
  }
  return uuid;
}

/**
 * Validates request body structure
 */
export function validateRequestBody<T extends Record<string, unknown>>(
  body: unknown,
  requiredFields: (keyof T)[]
): T {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object');
  }

  const validated = body as Partial<T>;
  
  for (const field of requiredFields) {
    if (!(field in validated) || validated[field] === null || validated[field] === undefined) {
      throw new Error(`${String(field)} is required`);
    }
  }

  return validated as T;
}
