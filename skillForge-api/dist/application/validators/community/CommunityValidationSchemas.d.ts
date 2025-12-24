import { z } from 'zod';
export declare const createCommunitySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    creditsCost: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    creditsPeriod: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateCommunitySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    videoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    creditsCost: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    creditsPeriod: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const sendMessageSchema: z.ZodObject<{
    communityId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        text: "text";
        file: "file";
        image: "image";
        video: "video";
    }>>>;
    replyToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    forwardedFromId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
//# sourceMappingURL=CommunityValidationSchemas.d.ts.map