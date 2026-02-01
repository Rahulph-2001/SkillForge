"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationStatusSchema = void 0;
const zod_1 = require("zod");
exports.UpdateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['SHORTLISTED', 'ACCEPTED', 'REJECTED']),
});
//# sourceMappingURL=UpdateApplicationStatusDTO.js.map