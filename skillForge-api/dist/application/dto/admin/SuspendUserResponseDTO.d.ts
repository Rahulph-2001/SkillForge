import { z } from 'zod';
/**
 * Zod schema for Suspend User Response DTO
 */
export declare const SuspendUserResponseDTOSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>;
export type SuspendUserResponseDTO = z.infer<typeof SuspendUserResponseDTOSchema>;
//# sourceMappingURL=SuspendUserResponseDTO.d.ts.map