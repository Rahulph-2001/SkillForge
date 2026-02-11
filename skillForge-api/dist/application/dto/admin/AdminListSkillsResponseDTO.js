"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListSkillsResponseDTOSchema = void 0;
const zod_1 = require("zod");
const AdminSkillDTO_1 = require("./AdminSkillDTO");
/**
 * Zod schema for Admin List Skills Response DTO
 */
exports.AdminListSkillsResponseDTOSchema = zod_1.z.object({
    skills: zod_1.z.array(AdminSkillDTO_1.AdminSkillDTOSchema),
    total: zod_1.z.number().int().min(0, 'Total must be non-negative'),
    page: zod_1.z.number().int().min(1),
    limit: zod_1.z.number().int().min(1),
    totalPages: zod_1.z.number().int().min(0),
    hasNextPage: zod_1.z.boolean(),
    hasPreviousPage: zod_1.z.boolean(),
});
//# sourceMappingURL=AdminListSkillsResponseDTO.js.map