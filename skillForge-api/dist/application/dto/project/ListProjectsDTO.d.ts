import { z } from 'zod';
export declare const ListProjectsRequestSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        Open: "Open";
        In_Progress: "In_Progress";
        Completed: "Completed";
        Cancelled: "Cancelled";
    }>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type ListProjectsRequestDTO = z.infer<typeof ListProjectsRequestSchema>;
export declare const ListProjectsResponseSchema: z.ZodObject<{
    projects: z.ZodArray<z.ZodAny>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type ListProjectsResponseDTO = z.infer<typeof ListProjectsResponseSchema>;
//# sourceMappingURL=ListProjectsDTO.d.ts.map