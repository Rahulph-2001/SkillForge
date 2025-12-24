import { z } from 'zod';
export declare const StartMCQImportRequestSchema: z.ZodObject<{
    templateId: z.ZodString;
    adminId: z.ZodString;
    fileName: z.ZodString;
    filePath: z.ZodString;
}, z.core.$strip>;
export type StartMCQImportRequestDTO = z.infer<typeof StartMCQImportRequestSchema>;
export interface StartMCQImportResponseDTO {
    jobId: string;
    fileName: string;
    status: string;
    message: string;
}
//# sourceMappingURL=StartMCQImportDTO.d.ts.map