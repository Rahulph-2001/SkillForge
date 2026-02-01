import { z } from 'zod';

export const CreateReviewSchema = z.object({
    bookingId: z.string().uuid(),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    review: z.string().min(10, 'Review must be at least 10 characters').max(2000),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;

export const ReviewResponseDTOSchema = z.object({
    id: z.string().uuid(),
    bookingId: z.string().uuid(),
    providerId: z.string().uuid(),
    learnerId: z.string().uuid(),
    skillId: z.string().uuid(),
    rating: z.number(),
    review: z.string(),
    createdAt: z.coerce.date(),
});

export type ReviewResponseDTO = z.infer<typeof ReviewResponseDTOSchema>;
