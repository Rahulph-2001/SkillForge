"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.updateCommunitySchema = exports.createCommunitySchema = void 0;
const zod_1 = require("zod");
// Create Community Validation Schema
exports.createCommunitySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Community name must be at least 3 characters')
        .max(100, 'Community name must not exceed 100 characters')
        .trim(),
    description: zod_1.z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .trim(),
    category: zod_1.z
        .string()
        .min(1, 'Category is required')
        .trim(),
    creditsCost: zod_1.z
        .number()
        .min(0, 'Credits cost must be non-negative')
        .optional()
        .default(0),
    creditsPeriod: zod_1.z
        .string()
        .optional()
        .default('30 days'),
});
// Update Community Validation Schema
exports.updateCommunitySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Community name must be at least 3 characters')
        .max(100, 'Community name must not exceed 100 characters')
        .trim()
        .optional(),
    description: zod_1.z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .trim()
        .optional(),
    category: zod_1.z
        .string()
        .min(1, 'Category is required')
        .trim()
        .optional(),
    imageUrl: zod_1.z
        .string()
        .url('Invalid image URL')
        .nullable()
        .optional(),
    videoUrl: zod_1.z
        .string()
        .url('Invalid video URL')
        .nullable()
        .optional(),
    creditsCost: zod_1.z
        .number()
        .min(0, 'Credits cost must be non-negative')
        .optional(),
    creditsPeriod: zod_1.z
        .string()
        .optional(),
});
// Send Message Validation Schema
exports.sendMessageSchema = zod_1.z.object({
    communityId: zod_1.z
        .string()
        .uuid('Invalid community ID'),
    content: zod_1.z
        .string()
        .min(1, 'Message content is required')
        .max(5000, 'Message content must not exceed 5000 characters')
        .trim(),
    type: zod_1.z
        .enum(['text', 'image', 'video', 'file'])
        .optional()
        .default('text'),
    replyToId: zod_1.z
        .string()
        .uuid('Invalid reply message ID')
        .nullable()
        .optional(),
    forwardedFromId: zod_1.z
        .string()
        .uuid('Invalid forwarded message ID')
        .nullable()
        .optional(),
});
//# sourceMappingURL=CommunityValidationSchemas.js.map