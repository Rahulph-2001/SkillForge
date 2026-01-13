import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationOptions {
    initialPage?: number;
    initialLimit?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

export interface UsePaginationReturn {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    setLimit: (limit: number) => void;
    reset: () => void;
    paginationInfo: {
        startIndex: number;
        endIndex: number;
        totalItems: number;
    };
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const {
        initialPage = 1,
        initialLimit = 20,
        totalItems = 0,
        onPageChange,
        onLimitChange,
    } = options;

    const [page, setPage] = useState(initialPage);
    const [limit, setLimitState] = useState(initialLimit);

    const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);
    const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
    const hasPreviousPage = useMemo(() => page > 1, [page]);

    const goToPage = useCallback((newPage: number) => {
        const validPage = Math.max(1, Math.min(newPage, totalPages));
        setPage(validPage);
        onPageChange?.(validPage);
    }, [totalPages, onPageChange]);

    const nextPage = useCallback(() => {
        if (hasNextPage) {
            goToPage(page + 1);
        }
    }, [page, hasNextPage, goToPage]);

    const previousPage = useCallback(() => {
        if (hasPreviousPage) {
            goToPage(page - 1);
        }
    }, [page, hasPreviousPage, goToPage]);

    const setLimit = useCallback((newLimit: number) => {
        setLimitState(newLimit);
        setPage(1); // Reset to first page when limit changes
        onLimitChange?.(newLimit);
    }, [onLimitChange]);

    const reset = useCallback(() => {
        setPage(initialPage);
        setLimitState(initialLimit);
    }, [initialPage, initialLimit]);

    const paginationInfo = useMemo(() => ({
        startIndex: totalItems === 0 ? 0 : (page - 1) * limit + 1,
        endIndex: Math.min(page * limit, totalItems),
        totalItems,
    }), [page, limit, totalItems]);

    return {
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        goToPage,
        nextPage,
        previousPage,
        setLimit,
        reset,
        paginationInfo,
    };
}