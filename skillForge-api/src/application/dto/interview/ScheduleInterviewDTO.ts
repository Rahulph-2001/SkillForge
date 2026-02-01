import { z } from 'zod';

export const ScheduleInterviewSchema = z.object({
    applicationId: z.string().uuid(),
    scheduledAt: z.coerce.date(),
    durationMinutes: z.number().min(15).max(180).optional(),
});

export type ScheduleInterviewDTO = z.infer<typeof ScheduleInterviewSchema>;

export const InterviewResponseSchema = z.object({
    id: z.string().uuid(),
    applicationId: z.string().uuid(),
    scheduledAt: z.coerce.date(),
    durationMinutes: z.number(),
    status: z.string(),
    meetingLink: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type InterviewResponseDTO = z.infer<typeof InterviewResponseSchema>;
