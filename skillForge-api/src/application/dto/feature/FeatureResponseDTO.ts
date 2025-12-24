import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';

/**
 * Zod schema for Feature Response DTO
 */
export const FeatureResponseDTOSchema = z.object({
    id: z.string().uuid('Invalid feature ID'),
    planId: z.string().uuid('Invalid plan ID').optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    featureType: z.nativeEnum(FeatureType, {
        message: 'Invalid feature type',
    }),
    limitValue: z.number().min(0).optional(),
    isEnabled: z.boolean(),
    displayOrder: z.number().int().min(0),
    isHighlighted: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type FeatureResponseDTO = z.infer<typeof FeatureResponseDTOSchema>;
