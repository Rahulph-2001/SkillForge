import { z } from 'zod';
/**
 * Zod schema for Block Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates block request
 */
export declare const BlockCommunityRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    communityId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BlockCommunityRequestDTO = z.infer<typeof BlockCommunityRequestSchema>;
//# sourceMappingURL=BlockCommunityRequestDTO.d.ts.map