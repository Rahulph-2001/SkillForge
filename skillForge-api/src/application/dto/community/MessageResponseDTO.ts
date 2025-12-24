import { z } from 'zod';

// Forward declaration for recursive type
const MessageResponseDTOSchemaBase = z.object({
  id: z.string().uuid('Invalid message ID'),
  communityId: z.string().uuid('Invalid community ID'),
  senderId: z.string().uuid('Invalid sender ID'),
  senderName: z.string().min(1, 'Sender name is required'),
  senderAvatar: z.string().url('Invalid avatar URL').nullable(),
  content: z.string().min(1, 'Content is required'),
  type: z.string().min(1, 'Type is required'),
  fileUrl: z.string().url('Invalid file URL').nullable(),
  fileName: z.string().nullable(),
  isPinned: z.boolean(),
  pinnedAt: z.coerce.date().nullable(),
  pinnedBy: z.string().uuid('Invalid user ID').nullable(),
  replyToId: z.string().uuid('Invalid message ID').nullable(),
  forwardedFromId: z.string().uuid('Invalid message ID').nullable(),
  reactions: z.array(z.any()).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Zod schema for Message Response DTO
 */
export const MessageResponseDTOSchema: z.ZodType<any> = MessageResponseDTOSchemaBase.extend({
  replyTo: z.lazy(() => MessageResponseDTOSchema).optional(),
});

export type MessageResponseDTO = z.infer<typeof MessageResponseDTOSchemaBase> & {
  replyTo?: MessageResponseDTO;
};