import { z } from 'zod';

export const StartMCQImportRequestSchema = z.object({
  templateId: z.string().uuid('Invalid template ID'),
  adminId: z.string().uuid('Invalid admin ID'),
  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .trim(),
  filePath: z.string()
    .min(1, 'File path is required')
    .url('Invalid file path'),
});

export type StartMCQImportRequestDTO = z.infer<typeof StartMCQImportRequestSchema>;

export interface StartMCQImportResponseDTO {
  jobId: string;
  fileName: string;
  status: string;
  message: string;
}