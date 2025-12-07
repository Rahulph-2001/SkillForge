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
export const isAdmin = (role: string): boolean => {
  return role === UserRole.ADMIN;
};

/**
 * Helper function to check if user is regular user
 */
export const isUser = (role: string): boolean => {
  return role === UserRole.USER;
};

