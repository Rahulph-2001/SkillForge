import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';
/**
 * Zod schema for Feature Response DTO
 */
export declare const FeatureResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    planId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    featureType: z.ZodEnum<typeof FeatureType>;
    limitValue: z.ZodOptional<z.ZodNumber>;
    isEnabled: z.ZodBoolean;
    displayOrder: z.ZodNumber;
    isHighlighted: z.ZodBoolean;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type FeatureResponseDTO = z.infer<typeof FeatureResponseDTOSchema>;
//# sourceMappingURL=FeatureResponseDTO.d.ts.map