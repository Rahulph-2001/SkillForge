import { z } from 'zod';
/**
 * Zod schema for List Subscription Plans Response DTO
 */
export declare const ListSubscriptionPlansResponseDTOSchema: z.ZodObject<{
    plans: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        price: z.ZodNumber;
        projectPosts: z.ZodNullable<z.ZodNumber>;
        createCommunity: z.ZodNullable<z.ZodNumber>;
        features: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            featureType: z.ZodEnum<typeof import("../../../domain/enums/SubscriptionEnums").FeatureType>;
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
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export type ListSubscriptionPlansResponseDTO = z.infer<typeof ListSubscriptionPlansResponseDTOSchema>;
//# sourceMappingURL=ListSubscriptionPlansResponseDTO.d.ts.map