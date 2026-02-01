import { z } from 'zod';
export declare const CreateVideoRoomSchema: z.ZodObject<{
    bookingId: z.ZodOptional<z.ZodString>;
    interviewId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateVideoRoomDTO = z.infer<typeof CreateVideoRoomSchema>;
//# sourceMappingURL=CreateVideoRoomDTO.d.ts.map