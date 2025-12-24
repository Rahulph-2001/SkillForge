import { z } from 'zod';
export declare const SendMessageSchema: z.ZodObject<{
    communityId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        text: "text";
        file: "file";
        image: "image";
        video: "video";
    }>>>;
    fileUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    replyToId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
//# sourceMappingURL=SendMessageDTO.d.ts.map