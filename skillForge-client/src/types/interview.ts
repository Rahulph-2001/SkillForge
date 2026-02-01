export interface ScheduleInterviewRequest {
    applicationId: string;
    scheduledAt: Date;
    durationMinutes: number;
}

export interface InterviewResponse {
    id: string;
    applicationId: string;
    scheduledAt: string;
    durationMinutes: number;
    status: string;
    meetingLink: string | null;
    createdAt: string;
    updatedAt: string;
}
