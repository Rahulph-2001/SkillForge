import { z } from 'zod';

/**
 * DTO for updating a subscription plan
 */
export const UpdateSubscriptionPlanDTOSchema = z.object({
  name: z.string().min(1, 'Plan name is required').optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  projectPosts: z.number().nullable().optional(),
  createCommunity: z.number().nullable().optional(),
  features: z.array(z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Feature name is required'),
    description: z.string().optional(),
    featureType: z.enum(['BOOLEAN', 'NUMERIC_LIMIT', 'TEXT']),
    limitValue: z.number().min(0).optional(),
    isEnabled: z.boolean().default(true),
    displayOrder: z.number().min(0).default(0),
    isHighlighted: z.boolean().default(false),
  })).optional(),
  badge: z.enum(['Free', 'Starter', 'Professional', 'Enterprise']).optional(),
  color: z.string().min(1, 'Color is required').optional(),
  description: z.string().optional(),
  currency: z.string().optional(),
  billingInterval: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME']).optional(),
  trialDays: z.number().min(0).optional(),
  isPopular: z.boolean().optional(),
  displayOrder: z.number().min(0).optional(),
  isPublic: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateSubscriptionPlanDTO = z.infer<typeof UpdateSubscriptionPlanDTOSchema>;
