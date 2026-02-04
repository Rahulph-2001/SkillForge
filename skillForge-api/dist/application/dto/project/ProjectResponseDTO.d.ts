import { z } from 'zod';
/**
 * Zod schema for Project Response DTO
 */
export declare const ProjectResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    clientId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    budget: z.ZodNumber;
    duration: z.ZodString;
    deadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
        Open: "Open";
        In_Progress: "In_Progress";
        Completed: "Completed";
        Cancelled: "Cancelled";
    }>;
    paymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    applicationsCount: z.ZodNumber;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    client: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rating: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        isVerified: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    acceptedContributor: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ProjectResponseDTO = z.infer<typeof ProjectResponseDTOSchema>;
//# sourceMappingURL=ProjectResponseDTO.d.ts.map