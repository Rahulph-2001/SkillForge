import { z } from 'zod';
export declare const JoinVideoRoomSchema: z.ZodObject<{
    roomId: z.ZodOptional<z.ZodString>;
    roomCode: z.ZodOptional<z.ZodString>;
    bookingId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type JoinVideoRoomDTO = z.infer<typeof JoinVideoRoomSchema>;
//# sourceMappingURL=JoinVideoRoomDTO.d.ts.map