import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';

export const CreateFeatureSchema = z.object({
    planId: z.string()
        .uuid('Invalid plan ID')
        .optional(),
    name: z.string()
        .min(1, 'Feature name is required')
        .max(255, 'Feature name too long')
        .trim(),
    description: z.string()
        .max(1000, 'Description too long')
        .trim()
        .optional(),
    featureType: z.nativeEnum(FeatureType, {
        message: 'Invalid feature type',
    }),
    limitValue: z.number()
        .int('Limit value must be an integer')
        .min(0, 'Limit value must be positive')
        .optional(),
    isEnabled: z.boolean()
        .default(true),
    isHighlighted: z.boolean()
        .default(false),
    displayOrder: z.number()
        .int('Display order must be an integer')
        .min(0, 'Display order must be non-negative')
        .default(0),
}).refine((data) => {
    // NUMERIC_LIMIT must have a limit value
    if (data.featureType === FeatureType.NUMERIC_LIMIT && data.limitValue === undefined) {
        return false;
    }
    return true;
}, {
    message: 'NUMERIC_LIMIT feature must have a limit value',
    path: ['limitValue'],
});

export type CreateFeatureDTO = z.infer<typeof CreateFeatureSchema>;
