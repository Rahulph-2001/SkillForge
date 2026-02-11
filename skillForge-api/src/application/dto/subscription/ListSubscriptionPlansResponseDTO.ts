import { z } from 'zod';
import { SubscriptionPlanDTOSchema } from './SubscriptionPlanDTO';


export const ListSubscriptionPlansResponseDTOSchema = z.object({
  plans: z.array(SubscriptionPlanDTOSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type ListSubscriptionPlansResponseDTO = z.infer<typeof ListSubscriptionPlansResponseDTOSchema>;