import { z } from 'zod';

export const JoinVideoRoomSchema = z
  .object({
    roomId: z.string().uuid().optional(),
    roomCode: z.string().min(7).max(10).optional(),
    bookingId: z.string().uuid().optional(),
  })
  .refine((data) => data.roomId || data.roomCode || data.bookingId, {
    message: 'One of roomId, roomCode, or bookingId is required',
  });

export type JoinVideoRoomDTO = z.infer<typeof JoinVideoRoomSchema>;