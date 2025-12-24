import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';

export const UpdateFeatureSchema = z.object({
    name: z.string()
        .min(1, 'Feature name is required')
        .max(255, 'Feature name too long')
        .trim()
        .optional(),
    description: z.string()
        .max(1000, 'Description too long')
        .trim()
        .optional(),
    limitValue: z.number()
        .int('Limit value must be an integer')
        .min(0, 'Limit value must be positive')
        .optional(),
    isEnabled: z.boolean()
        .optional(),
    isHighlighted: z.boolean()
        .optional(),
    displayOrder: z.number()
        .int('Display order must be an integer')
        .min(0, 'Display order must be non-negative')
        .optional(),
});

export type UpdateFeatureDTO = z.infer<typeof UpdateFeatureSchema>;
