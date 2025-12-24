"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartMCQRequestSchema = void 0;
const zod_1 = require("zod");
exports.StartMCQRequestSchema = zod_1.z.object({
    skillId: zod_1.z.string().uuid('Invalid skill ID'),
    userId: zod_1.z.string().uuid('Invalid user ID'),
});
//# sourceMappingURL=StartMCQRequestDTO.js.map