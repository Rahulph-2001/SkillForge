import { z } from 'zod';

// Create Community Validation Schema
export const createCommunitySchema = z.object({
    name: z
        .string()
        .min(3, 'Community name must be at least 3 characters')
        .max(100, 'Community name must not exceed 100 characters')
        .trim(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .trim(),
    category: z
        .string()
        .min(1, 'Category is required')
        .trim(),
    creditsCost: z
        .number()
        .min(0, 'Credits cost must be non-negative')
        .optional()
        .default(0),
    creditsPeriod: z
        .string()
        .optional()
        .default('30 days'),
});

// Update Community Validation Schema
export const updateCommunitySchema = z.object({
    name: z
        .string()
        .min(3, 'Community name must be at least 3 characters')
        .max(100, 'Community name must not exceed 100 characters')
        .trim()
        .optional(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .trim()
        .optional(),
    category: z
        .string()
        .min(1, 'Category is required')
        .trim()
        .optional(),
    imageUrl: z
        .string()
        .url('Invalid image URL')
        .nullable()
        .optional(),
    videoUrl: z
        .string()
        .url('Invalid video URL')
        .nullable()
        .optional(),
    creditsCost: z
        .number()
        .min(0, 'Credits cost must be non-negative')
        .optional(),
    creditsPeriod: z
        .string()
        .optional(),
});

// Send Message Validation Schema
export const sendMessageSchema = z.object({
    communityId: z
        .string()
        .uuid('Invalid community ID'),
    content: z
        .string()
        .min(1, 'Message content is required')
        .max(5000, 'Message content must not exceed 5000 characters')
        .trim(),
    type: z
        .enum(['text', 'image', 'video', 'file'])
        .optional()
        .default('text'),
    replyToId: z
        .string()
        .uuid('Invalid reply message ID')
        .nullable()
        .optional(),
    forwardedFromId: z
        .string()
        .uuid('Invalid forwarded message ID')
        .nullable()
        .optional(),
});

// Export types
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
