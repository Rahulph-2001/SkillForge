"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = void 0;
const zod_1 = require("zod");
exports.SendMessageSchema = zod_1.z.object({
    communityId: zod_1.z.string().uuid('Invalid community ID'),
    content: zod_1.z.string()
        .min(1, 'Message content is required')
        .max(2000, 'Message must not exceed 2000 characters')
        .trim(),
    type: zod_1.z.enum(['text', 'image', 'video', 'file'], {
        message: 'Invalid message type',
    }).optional().default('text'),
    fileUrl: zod_1.z.string()
        .url('Invalid file URL')
        .optional(),
    fileName: zod_1.z.string()
        .max(255, 'File name too long')
        .optional(),
    replyToId: zod_1.z.string()
        .uuid('Invalid reply message ID')
        .optional(),
});
//# sourceMappingURL=SendMessageDTO.js.map