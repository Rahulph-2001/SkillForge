import { z } from 'zod';
export declare const ScheduleInterviewSchema: z.ZodObject<{
    applicationId: z.ZodString;
    scheduledAt: z.ZodCoercedDate<unknown>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ScheduleInterviewDTO = z.infer<typeof ScheduleInterviewSchema>;
export declare const InterviewResponseSchema: z.ZodObject<{
    id: z.ZodString;
    applicationId: z.ZodString;
    scheduledAt: z.ZodCoercedDate<unknown>;
    durationMinutes: z.ZodNumber;
    status: z.ZodString;
    meetingLink: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type InterviewResponseDTO = z.infer<typeof InterviewResponseSchema>;
//# sourceMappingURL=ScheduleInterviewDTO.d.ts.map