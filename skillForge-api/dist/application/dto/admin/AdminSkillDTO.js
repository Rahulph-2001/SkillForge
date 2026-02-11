"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSkillDTOSchema = void 0;
const zod_1 = require("zod");
const PendingSkillDTO_1 = require("./PendingSkillDTO");
/**
 * Extended Pending Skill DTO with admin-specific fields
 */
exports.AdminSkillDTOSchema = PendingSkillDTO_1.PendingSkillDTOSchema.extend({
    isBlocked: zod_1.z.boolean(),
    blockedReason: zod_1.z.string().nullable(),
    blockedAt: zod_1.z.coerce.date().nullable(),
    totalSessions: zod_1.z.number().int().min(0),
    rating: zod_1.z.number().min(0).max(5),
    rejectionReason: zod_1.z.string().nullable(),
});
//# sourceMappingURL=AdminSkillDTO.js.map