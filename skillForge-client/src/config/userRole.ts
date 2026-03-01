/**
 * User Role Constants
 * Centralized enum for user roles to maintain consistency across the frontend
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * Helper function to check if user is admin
 */
export const isAdmin = (role: string | UserRole): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  return role === UserRole.ADMIN || role === 'admin';
};

/**
 * Helper function to check if user is regular user
 */
export const isUser = (role: string | UserRole): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  return role === UserRole.USER || role === 'user';
};

