import { z } from 'zod';
export declare const WebhookEventDTOSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    data: z.ZodObject<{
        object: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type WebhookEventDTO = z.infer<typeof WebhookEventDTOSchema>;
//# sourceMappingURL=WebhookEventDTO.d.ts.map