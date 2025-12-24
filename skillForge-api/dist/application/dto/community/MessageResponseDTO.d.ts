import { z } from 'zod';
declare const MessageResponseDTOSchemaBase: z.ZodObject<{
    id: z.ZodString;
    communityId: z.ZodString;
    senderId: z.ZodString;
    senderName: z.ZodString;
    senderAvatar: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    type: z.ZodString;
    fileUrl: z.ZodNullable<z.ZodString>;
    fileName: z.ZodNullable<z.ZodString>;
    isPinned: z.ZodBoolean;
    pinnedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    pinnedBy: z.ZodNullable<z.ZodString>;
    replyToId: z.ZodNullable<z.ZodString>;
    forwardedFromId: z.ZodNullable<z.ZodString>;
    reactions: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
/**
 * Zod schema for Message Response DTO
 */
export declare const MessageResponseDTOSchema: z.ZodType<any>;
export type MessageResponseDTO = z.infer<typeof MessageResponseDTOSchemaBase> & {
    replyTo?: MessageResponseDTO;
};
export {};
//# sourceMappingURL=MessageResponseDTO.d.ts.map