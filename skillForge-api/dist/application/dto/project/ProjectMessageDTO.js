"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMessageResponseSchema = exports.CreateProjectMessageSchema = void 0;
const zod_1 = require("zod");
exports.CreateProjectMessageSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    // senderId is usually taken from the authenticated user, but schema validation can verify it if passed
    content: zod_1.z.string()
        .min(1, 'Message cannot be empty')
        .max(5000, 'Message cannot exceed 5000 characters')
        .trim(),
});
exports.ProjectMessageResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    projectId: zod_1.z.string().uuid(),
    senderId: zod_1.z.string().uuid(),
    content: zod_1.z.string(),
    isRead: zod_1.z.boolean(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    sender: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        avatarUrl: zod_1.z.string().nullable().optional(),
    }).optional(),
    isMine: zod_1.z.boolean().optional(), // Helper for frontend styling
});
//# sourceMappingURL=ProjectMessageDTO.js.map