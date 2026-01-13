import { z } from 'zod';
export declare const PaginationRequestSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type PaginationRequestDTO = z.infer<typeof PaginationRequestSchema>;
//# sourceMappingURL=PaginationRequestDTO.d.ts.map