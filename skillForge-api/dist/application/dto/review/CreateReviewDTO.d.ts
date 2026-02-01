import { z } from 'zod';
export declare const CreateReviewSchema: z.ZodObject<{
    bookingId: z.ZodString;
    rating: z.ZodNumber;
    review: z.ZodString;
}, z.core.$strip>;
export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;
export declare const ReviewResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    bookingId: z.ZodString;
    providerId: z.ZodString;
    learnerId: z.ZodString;
    skillId: z.ZodString;
    rating: z.ZodNumber;
    review: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type ReviewResponseDTO = z.infer<typeof ReviewResponseDTOSchema>;
//# sourceMappingURL=CreateReviewDTO.d.ts.map