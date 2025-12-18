import { z } from 'zod';
export declare const AdminLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type AdminLoginDTO = z.infer<typeof AdminLoginSchema>;
//# sourceMappingURL=AdminLoginDTO.d.ts.map