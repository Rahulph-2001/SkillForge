import { z } from 'zod';
import { SubscriptionPlanDTOSchema } from './SubscriptionPlanDTO';

/**
 * Zod schema for List Public Subscription Plans Response DTO
 */
export const ListPublicSubscriptionPlansResponseDTOSchema = z.object({
  plans: z.array(SubscriptionPlanDTOSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
});

export type ListPublicSubscriptionPlansResponseDTO = z.infer<typeof ListPublicSubscriptionPlansResponseDTOSchema>;
