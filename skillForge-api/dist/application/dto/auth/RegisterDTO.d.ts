import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
//# sourceMappingURL=RegisterDTO.d.ts.map