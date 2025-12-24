import { z } from 'zod';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';
export declare const CreateFeatureSchema: z.ZodObject<{
    planId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    featureType: z.ZodEnum<typeof FeatureType>;
    limitValue: z.ZodOptional<z.ZodNumber>;
    isEnabled: z.ZodDefault<z.ZodBoolean>;
    isHighlighted: z.ZodDefault<z.ZodBoolean>;
    displayOrder: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CreateFeatureDTO = z.infer<typeof CreateFeatureSchema>;
//# sourceMappingURL=CreateFeatureDTO.d.ts.map