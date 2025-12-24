import { z } from 'zod';
import { ImportStatus } from '../../../domain/entities/MCQImportJob';

/**
 * Zod schema for MCQ Import Job DTO
 */
export const MCQImportJobDTOSchema = z.object({
  id: z.string().uuid('Invalid job ID'),
  fileName: z.string().min(1, 'File name is required'),
  templateId: z.string().uuid('Invalid template ID'),
  adminId: z.string().uuid('Invalid admin ID'),
  status: z.nativeEnum(ImportStatus, {
    message: 'Invalid import status',
  }),
  totalRows: z.number().int().min(0, 'Total rows must be non-negative'),
  processedRows: z.number().int().min(0, 'Processed rows must be non-negative'),
  successfulRows: z.number().int().min(0, 'Successful rows must be non-negative'),
  failedRows: z.number().int().min(0, 'Failed rows must be non-negative'),
  errorFileUrl: z.string().url('Invalid error file URL').nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
});

export type MCQImportJobDTO = z.infer<typeof MCQImportJobDTOSchema>;

/**
 * Zod schema for List MCQ Import Jobs Response DTO
 */
export const ListMCQImportJobsResponseDTOSchema = z.object({
  jobs: z.array(MCQImportJobDTOSchema),
});

export type ListMCQImportJobsResponseDTO = z.infer<typeof ListMCQImportJobsResponseDTOSchema>;