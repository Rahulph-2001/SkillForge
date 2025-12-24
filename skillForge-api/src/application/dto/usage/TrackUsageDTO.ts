import { z } from 'zod';

export const TrackUsageSchema = z.object({
    subscriptionId: z.string()
        .uuid('Invalid subscription ID'),
    featureKey: z.string()
        .min(1, 'Feature key is required')
        .max(100, 'Feature key too long')
        .trim(),
    incrementBy: z.number()
        .int('Increment must be an integer')
        .min(1, 'Increment must be at least 1')
        .default(1),
});

export type TrackUsageDTO = z.infer<typeof TrackUsageSchema>;
