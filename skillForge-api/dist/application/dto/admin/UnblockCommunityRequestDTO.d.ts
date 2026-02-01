import { z } from 'zod';
/**
 * Zod schema for Unblock Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates unblock request
 */
export declare const UnblockCommunityRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    communityId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UnblockCommunityRequestDTO = z.infer<typeof UnblockCommunityRequestSchema>;
//# sourceMappingURL=UnblockCommunityRequestDTO.d.ts.map