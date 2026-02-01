import { z } from 'zod'
export const CreateVideoRoomSchema = z.object({
    bookingId: z.string().uuid('Invalid booking ID').optional(),
    interviewId: z.string().uuid('Invalid interview ID').optional(),

});
export type CreateVideoRoomDTO = z.infer<typeof CreateVideoRoomSchema>