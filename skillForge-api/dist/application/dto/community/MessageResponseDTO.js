"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResponseDTOSchema = void 0;
const zod_1 = require("zod");
// Forward declaration for recursive type
const MessageResponseDTOSchemaBase = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid message ID'),
    communityId: zod_1.z.string().uuid('Invalid community ID'),
    senderId: zod_1.z.string().uuid('Invalid sender ID'),
    senderName: zod_1.z.string().min(1, 'Sender name is required'),
    senderAvatar: zod_1.z.string().url('Invalid avatar URL').nullable(),
    content: zod_1.z.string().min(1, 'Content is required'),
    type: zod_1.z.string().min(1, 'Type is required'),
    fileUrl: zod_1.z.string().url('Invalid file URL').nullable(),
    fileName: zod_1.z.string().nullable(),
    isPinned: zod_1.z.boolean(),
    pinnedAt: zod_1.z.coerce.date().nullable(),
    pinnedBy: zod_1.z.string().uuid('Invalid user ID').nullable(),
    replyToId: zod_1.z.string().uuid('Invalid message ID').nullable(),
    forwardedFromId: zod_1.z.string().uuid('Invalid message ID').nullable(),
    reactions: zod_1.z.array(zod_1.z.any()).optional(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
/**
 * Zod schema for Message Response DTO
 */
exports.MessageResponseDTOSchema = MessageResponseDTOSchemaBase.extend({
    replyTo: zod_1.z.lazy(() => exports.MessageResponseDTOSchema).optional(),
});
//# sourceMappingURL=MessageResponseDTO.js.map