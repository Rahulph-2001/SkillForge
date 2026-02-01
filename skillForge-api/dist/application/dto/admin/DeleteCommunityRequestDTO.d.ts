import { z } from 'zod';
/**
 * Zod schema for Delete Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates delete request
 */
export declare const DeleteCommunityRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    communityId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DeleteCommunityRequestDTO = z.infer<typeof DeleteCommunityRequestSchema>;
//# sourceMappingURL=DeleteCommunityRequestDTO.d.ts.map