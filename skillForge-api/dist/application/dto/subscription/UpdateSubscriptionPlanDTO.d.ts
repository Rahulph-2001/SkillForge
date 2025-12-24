import { z } from 'zod';
/**
 * DTO for updating a subscription plan
 */
export declare const UpdateSubscriptionPlanDTOSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    projectPosts: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createCommunity: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    features: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        featureType: z.ZodEnum<{
            BOOLEAN: "BOOLEAN";
            NUMERIC_LIMIT: "NUMERIC_LIMIT";
            TEXT: "TEXT";
        }>;
        limitValue: z.ZodOptional<z.ZodNumber>;
        isEnabled: z.ZodDefault<z.ZodBoolean>;
        displayOrder: z.ZodDefault<z.ZodNumber>;
        isHighlighted: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    badge: z.ZodOptional<z.ZodEnum<{
        Free: "Free";
        Starter: "Starter";
        Professional: "Professional";
        Enterprise: "Enterprise";
    }>>;
    color: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    billingInterval: z.ZodOptional<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        QUARTERLY: "QUARTERLY";
        YEARLY: "YEARLY";
        LIFETIME: "LIFETIME";
    }>>;
    trialDays: z.ZodOptional<z.ZodNumber>;
    isPopular: z.ZodOptional<z.ZodBoolean>;
    displayOrder: z.ZodOptional<z.ZodNumber>;
    isPublic: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateSubscriptionPlanDTO = z.infer<typeof UpdateSubscriptionPlanDTOSchema>;
//# sourceMappingURL=UpdateSubscriptionPlanDTO.d.ts.map