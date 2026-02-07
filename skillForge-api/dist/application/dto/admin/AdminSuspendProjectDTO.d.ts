import { z } from 'zod';
export declare const AdminSuspendProjectRequestDTOSchema: z.ZodObject<{
    reason: z.ZodString;
    withRefund: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type AdminSuspendProjectRequestDTO = z.infer<typeof AdminSuspendProjectRequestDTOSchema>;
export declare const AdminSuspendProjectResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    isSuspended: z.ZodBoolean;
    suspendedAt: z.ZodCoercedDate<unknown>;
    suspendReason: z.ZodString;
    refundProcessed: z.ZodBoolean;
}, z.core.$strip>;
export type AdminSuspendProjectResponseDTO = z.infer<typeof AdminSuspendProjectResponseDTOSchema>;
//# sourceMappingURL=AdminSuspendProjectDTO.d.ts.map