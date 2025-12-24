import { z } from 'zod';

/**
 * DTO for creating a subscription plan
 */
export const CreateSubscriptionPlanDTOSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  projectPosts: z.number().nullable().optional(),
  createCommunity: z.number().nullable().optional(),
  features: z.array(z.object({
    id: z.string().uuid().optional(), // If provided, might be a library feature or existing feature
    name: z.string().min(1, 'Feature name is required'),
    description: z.string().optional(),
    featureType: z.enum(['BOOLEAN', 'NUMERIC_LIMIT', 'TEXT']),
    limitValue: z.number().min(0).optional(),
    isEnabled: z.boolean().default(true),
    displayOrder: z.number().min(0).default(0),
    isHighlighted: z.boolean().default(false),
  })).optional().default([]),
  badge: z.enum(['Free', 'Starter', 'Professional', 'Enterprise']),
  color: z.string().min(1, 'Color is required'),
  description: z.string().optional(),
  currency: z.string().optional().default('INR'),
  billingInterval: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME']).optional().default('MONTHLY'),
  trialDays: z.number().min(0).optional().default(0),
  isPopular: z.boolean().optional().default(false),
  displayOrder: z.number().min(0).optional().default(0),
  isPublic: z.boolean().optional().default(true),
});

export type CreateSubscriptionPlanDTO = z.infer<typeof CreateSubscriptionPlanDTOSchema>;
