import { z } from 'zod';
export declare const CreateProjectRequestSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    budget: z.ZodNumber;
    duration: z.ZodString;
    deadline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateProjectRequestDTO = z.infer<typeof CreateProjectRequestSchema>;
//# sourceMappingURL=CreateProjectDTO.d.ts.map