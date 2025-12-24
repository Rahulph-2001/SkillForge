import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';
/**
 * Zod schema for Subscription Feature DTO
 */
export declare const SubscriptionFeatureDTOSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    featureType: z.ZodEnum<typeof FeatureType>;
    limitValue: z.ZodOptional<z.ZodNumber>;
    isEnabled: z.ZodBoolean;
    displayOrder: z.ZodNumber;
    isHighlighted: z.ZodBoolean;
}, z.core.$strip>;
export type SubscriptionFeatureDTO = z.infer<typeof SubscriptionFeatureDTOSchema>;
/**
 * Zod schema for Subscription Plan DTO
 */
export declare const SubscriptionPlanDTOSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    projectPosts: z.ZodNullable<z.ZodNumber>;
    createCommunity: z.ZodNullable<z.ZodNumber>;
    features: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        featureType: z.ZodEnum<typeof FeatureType>;
        limitValue: z.ZodOptional<z.ZodNumber>;
        isEnabled: z.ZodBoolean;
        displayOrder: z.ZodNumber;
        isHighlighted: z.ZodBoolean;
    }, z.core.$strip>>;
    badge: z.ZodEnum<{
        Free: "Free";
        Starter: "Starter";
        Professional: "Professional";
        Enterprise: "Enterprise";
    }>;
    color: z.ZodString;
    isActive: z.ZodBoolean;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type SubscriptionPlanDTO = z.infer<typeof SubscriptionPlanDTOSchema>;
//# sourceMappingURL=SubscriptionPlanDTO.d.ts.map