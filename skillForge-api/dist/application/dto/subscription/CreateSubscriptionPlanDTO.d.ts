import { z } from 'zod';
/**
 * DTO for creating a subscription plan
 */
export declare const CreateSubscriptionPlanDTOSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    projectPosts: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createCommunity: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    features: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>>>;
    badge: z.ZodEnum<{
        Free: "Free";
        Starter: "Starter";
        Professional: "Professional";
        Enterprise: "Enterprise";
    }>;
    color: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    billingInterval: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        QUARTERLY: "QUARTERLY";
        YEARLY: "YEARLY";
        LIFETIME: "LIFETIME";
    }>>>;
    trialDays: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isPopular: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    displayOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isPublic: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateSubscriptionPlanDTO = z.infer<typeof CreateSubscriptionPlanDTOSchema>;
//# sourceMappingURL=CreateSubscriptionPlanDTO.d.ts.map