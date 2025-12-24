import { z } from 'zod';

export const SendMessageSchema = z.object({
  communityId: z.string().uuid('Invalid community ID'),
  content: z.string()
    .min(1, 'Message content is required')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim(),
  type: z.enum(['text', 'image', 'video', 'file'], {
    message: 'Invalid message type',
  }).optional().default('text'),
  fileUrl: z.string()
    .url('Invalid file URL')
    .optional(),
  fileName: z.string()
    .max(255, 'File name too long')
    .optional(),
  replyToId: z.string()
    .uuid('Invalid reply message ID')
    .optional(),
});

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
