import { z } from 'zod';
export declare const CreateBookingRequestSchema: z.ZodObject<{
    learnerId: z.ZodString;
    skillId: z.ZodString;
    providerId: z.ZodString;
    preferredDate: z.ZodString;
    preferredTime: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateBookingRequestDTO = z.infer<typeof CreateBookingRequestSchema>;
//# sourceMappingURL=CreateBookingRequestDTO.d.ts.map