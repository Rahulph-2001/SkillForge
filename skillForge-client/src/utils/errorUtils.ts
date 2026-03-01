/**
 * Shared error utilities for consistent error handling across the application.
 * These utilities eliminate the need for `any` in catch blocks and Redux rejected handlers.
 */

/** Shape of an API error payload returned by the backend */
export interface ApiErrorPayload {
    success?: boolean;
    error?: string | { message?: string };
    message?: string;
    details?: Array<{ field: string; message: string }>;
    code?: string;
}

/**
 * Narrows an `unknown` catch value to a human-readable error message.
 * Handles: Error instances, plain strings, Axios errors, and unknown shapes.
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;

    // Handle Axios-style errors: { response: { data: ApiErrorPayload } }
    const axiosLike = error as {
        response?: { data?: ApiErrorPayload };
        message?: string;
        code?: string;
    };

    const data = axiosLike?.response?.data;
    if (data?.error) {
        const e = data.error;
        return typeof e === 'string' ? e : (e.message ?? fallback);
    }

    return axiosLike?.message ?? fallback;
}

/**
 * Extracts a human-readable message from a Redux rejected action payload.
 * Handles validation `details` arrays, `error` strings/objects, and plain `message` fields.
 */
export function extractRejectedMessage(
    payload: ApiErrorPayload | undefined,
    fallback: string
): string {
    if (!payload) return fallback;

    const { error, message, details } = payload;

    if (details?.length) {
        return details.map((d) => d.message).join(', ');
    }

    if (error) {
        return typeof error === 'string' ? error : (error.message ?? fallback);
    }

    return message ?? fallback;
}
