import { z } from 'zod';
export declare const CreateProjectMessageSchema: z.ZodObject<{
    projectId: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export type CreateProjectMessageRequestDTO = z.infer<typeof CreateProjectMessageSchema>;
export declare const ProjectMessageResponseSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    senderId: z.ZodString;
    content: z.ZodString;
    isRead: z.ZodBoolean;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    sender: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    isMine: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ProjectMessageResponseDTO = z.infer<typeof ProjectMessageResponseSchema>;
//# sourceMappingURL=ProjectMessageDTO.d.ts.map