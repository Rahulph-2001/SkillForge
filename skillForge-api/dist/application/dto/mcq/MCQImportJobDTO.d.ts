import { z } from 'zod';
import { ImportStatus } from '../../../domain/entities/MCQImportJob';
/**
 * Zod schema for MCQ Import Job DTO
 */
export declare const MCQImportJobDTOSchema: z.ZodObject<{
    id: z.ZodString;
    fileName: z.ZodString;
    templateId: z.ZodString;
    adminId: z.ZodString;
    status: z.ZodEnum<typeof ImportStatus>;
    totalRows: z.ZodNumber;
    processedRows: z.ZodNumber;
    successfulRows: z.ZodNumber;
    failedRows: z.ZodNumber;
    errorFileUrl: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    startedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    completedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type MCQImportJobDTO = z.infer<typeof MCQImportJobDTOSchema>;
/**
 * Zod schema for List MCQ Import Jobs Response DTO
 */
export declare const ListMCQImportJobsResponseDTOSchema: z.ZodObject<{
    jobs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        fileName: z.ZodString;
        templateId: z.ZodString;
        adminId: z.ZodString;
        status: z.ZodEnum<typeof ImportStatus>;
        totalRows: z.ZodNumber;
        processedRows: z.ZodNumber;
        successfulRows: z.ZodNumber;
        failedRows: z.ZodNumber;
        errorFileUrl: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
        startedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
        completedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ListMCQImportJobsResponseDTO = z.infer<typeof ListMCQImportJobsResponseDTOSchema>;
//# sourceMappingURL=MCQImportJobDTO.d.ts.map