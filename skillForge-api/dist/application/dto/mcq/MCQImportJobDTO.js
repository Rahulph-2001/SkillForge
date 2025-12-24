"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMCQImportJobsResponseDTOSchema = exports.MCQImportJobDTOSchema = void 0;
const zod_1 = require("zod");
const MCQImportJob_1 = require("../../../domain/entities/MCQImportJob");
/**
 * Zod schema for MCQ Import Job DTO
 */
exports.MCQImportJobDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid job ID'),
    fileName: zod_1.z.string().min(1, 'File name is required'),
    templateId: zod_1.z.string().uuid('Invalid template ID'),
    adminId: zod_1.z.string().uuid('Invalid admin ID'),
    status: zod_1.z.nativeEnum(MCQImportJob_1.ImportStatus, {
        message: 'Invalid import status',
    }),
    totalRows: zod_1.z.number().int().min(0, 'Total rows must be non-negative'),
    processedRows: zod_1.z.number().int().min(0, 'Processed rows must be non-negative'),
    successfulRows: zod_1.z.number().int().min(0, 'Successful rows must be non-negative'),
    failedRows: zod_1.z.number().int().min(0, 'Failed rows must be non-negative'),
    errorFileUrl: zod_1.z.string().url('Invalid error file URL').nullable(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    startedAt: zod_1.z.coerce.date().nullable(),
    completedAt: zod_1.z.coerce.date().nullable(),
});
/**
 * Zod schema for List MCQ Import Jobs Response DTO
 */
exports.ListMCQImportJobsResponseDTOSchema = zod_1.z.object({
    jobs: zod_1.z.array(exports.MCQImportJobDTOSchema),
});
//# sourceMappingURL=MCQImportJobDTO.js.map