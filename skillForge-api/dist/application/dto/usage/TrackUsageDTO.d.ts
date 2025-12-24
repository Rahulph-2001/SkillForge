import { z } from 'zod';
export declare const TrackUsageSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
    featureKey: z.ZodString;
    incrementBy: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type TrackUsageDTO = z.infer<typeof TrackUsageSchema>;
//# sourceMappingURL=TrackUsageDTO.d.ts.map