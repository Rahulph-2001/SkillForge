"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartMCQImportRequestSchema = void 0;
const zod_1 = require("zod");
exports.StartMCQImportRequestSchema = zod_1.z.object({
    templateId: zod_1.z.string().uuid('Invalid template ID'),
    adminId: zod_1.z.string().uuid('Invalid admin ID'),
    fileName: zod_1.z.string()
        .min(1, 'File name is required')
        .max(255, 'File name too long')
        .trim(),
    filePath: zod_1.z.string()
        .min(1, 'File path is required')
        .url('Invalid file path'),
});
//# sourceMappingURL=StartMCQImportDTO.js.map