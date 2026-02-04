import { z } from 'zod';
/**
 * Zod schema for Booking Response DTO
 */
export declare const BookingResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    skillId: z.ZodString;
    skillTitle: z.ZodOptional<z.ZodString>;
    providerId: z.ZodString;
    providerName: z.ZodOptional<z.ZodString>;
    providerAvatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    learnerId: z.ZodString;
    learnerName: z.ZodOptional<z.ZodString>;
    learnerAvatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    preferredDate: z.ZodString;
    preferredTime: z.ZodString;
    duration: z.ZodOptional<z.ZodNumber>;
    message: z.ZodNullable<z.ZodString>;
    status: z.ZodString;
    sessionCost: z.ZodNumber;
    rescheduleInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        newDate: z.ZodString;
        newTime: z.ZodString;
        reason: z.ZodString;
        requestedBy: z.ZodEnum<{
            provider: "provider";
            learner: "learner";
        }>;
        requestedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    isReviewed: z.ZodOptional<z.ZodBoolean>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type BookingResponseDTO = z.infer<typeof BookingResponseDTOSchema>;
//# sourceMappingURL=BookingResponseDTO.d.ts.map