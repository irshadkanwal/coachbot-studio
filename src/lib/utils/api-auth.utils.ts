import { NextRequest } from 'next/server';

/**
 * Validates Bearer token authentication for internal service-to-service communication.
 * Used by webhook services (WhatsApp, SMS) to authenticate with our API.
 *
 * @param request - The incoming Next.js request
 * @param expectedToken - The expected token value (from environment variable)
 * @returns Object with isValid flag and optional error message
 */
export function validateBearerToken(
  request: NextRequest,
  expectedToken: string | undefined
): { isValid: boolean; error?: string } {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !expectedToken) {
    return {
      isValid: false,
      error: 'Unauthorized access',
    };
  }

  const token = authorization.replace('Bearer ', '');
  if (token !== expectedToken) {
    return {
      isValid: false,
      error: 'Invalid API token',
    };
  }

  return { isValid: true };
}

/**
 * Validates UUID format for assistant IDs
 *
 * @param id - The ID string to validate
 * @returns true if valid UUID format, false otherwise
 */
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
