/**
 * Safely extracts a human-readable message from an unknown caught value.
 * Use this in every catch block instead of casting `error: any`.
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error);
}
