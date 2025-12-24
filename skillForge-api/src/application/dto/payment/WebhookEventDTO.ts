
import { z } from 'zod';

export const WebhookEventDTOSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
        object: z.record(z.string(), z.any()),
    }),
});

export type WebhookEventDTO = z.infer<typeof WebhookEventDTOSchema>;