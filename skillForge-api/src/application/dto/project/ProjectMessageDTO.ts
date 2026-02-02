
import { z } from 'zod';

export const CreateProjectMessageSchema = z.object({
    projectId: z.string().uuid(),
    // senderId is usually taken from the authenticated user, but schema validation can verify it if passed
    content: z.string()
        .min(1, 'Message cannot be empty')
        .max(5000, 'Message cannot exceed 5000 characters')
        .trim(),
});

export type CreateProjectMessageRequestDTO = z.infer<typeof CreateProjectMessageSchema>;

export const ProjectMessageResponseSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    senderId: z.string().uuid(),
    content: z.string(),
    isRead: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    sender: z.object({
        id: z.string().uuid(),
        name: z.string(),
        avatarUrl: z.string().nullable().optional(),
    }).optional(),
    isMine: z.boolean().optional(), // Helper for frontend styling
});

export type ProjectMessageResponseDTO = z.infer<typeof ProjectMessageResponseSchema>;
