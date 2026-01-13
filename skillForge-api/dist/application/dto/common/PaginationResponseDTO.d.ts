import { z } from 'zod';
export declare const PaginationResponseSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    data: z.ZodArray<T>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
    hasNextPage: z.ZodBoolean;
    hasPreviousPage: z.ZodBoolean;
}, z.core.$strip>;
export type PaginationResponseDTO<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};
//# sourceMappingURL=PaginationResponseDTO.d.ts.map