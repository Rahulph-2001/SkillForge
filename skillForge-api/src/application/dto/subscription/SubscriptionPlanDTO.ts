import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';

/**
 * Zod schema for Subscription Feature DTO
 */
export const SubscriptionFeatureDTOSchema = z.object({
  id: z.string().uuid('Invalid feature ID'),
  name: z.string().min(1, 'Feature name is required'),
  description: z.string().optional(),
  featureType: z.nativeEnum(FeatureType, {
    message: 'Invalid feature type',
  }),
  limitValue: z.number().min(0).optional(),
  isEnabled: z.boolean(),
  displayOrder: z.number().min(0),
  isHighlighted: z.boolean(),
});

export type SubscriptionFeatureDTO = z.infer<typeof SubscriptionFeatureDTOSchema>;

/**
 * Zod schema for Subscription Plan DTO
 */
export const SubscriptionPlanDTOSchema = z.object({
  id: z.string().uuid('Invalid plan ID'),
  name: z.string().min(1, 'Plan name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  projectPosts: z.number().nullable(),
  createCommunity: z.number().nullable(),
  features: z.array(SubscriptionFeatureDTOSchema),
  badge: z.enum(['Free', 'Starter', 'Professional', 'Enterprise']),
  color: z.string().min(1, 'Color is required'),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SubscriptionPlanDTO = z.infer<typeof SubscriptionPlanDTOSchema>;
