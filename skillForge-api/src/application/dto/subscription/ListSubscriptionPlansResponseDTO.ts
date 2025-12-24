import { z } from 'zod';
import { SubscriptionPlanDTOSchema } from './SubscriptionPlanDTO';

/**
 * Zod schema for List Subscription Plans Response DTO
 */
export const ListSubscriptionPlansResponseDTOSchema = z.object({
  plans: z.array(SubscriptionPlanDTOSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
});

export type ListSubscriptionPlansResponseDTO = z.infer<typeof ListSubscriptionPlansResponseDTOSchema>;
