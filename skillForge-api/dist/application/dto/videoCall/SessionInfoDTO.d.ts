export interface SessionInfoDTO {
    providerId: string;
    skillTitle: string;
    providerName: string;
    providerAvatar: string | null;
    learnerName: string;
    learnerAvatar?: string | null;
    scheduledAt: Date;
    duration: number;
    status?: string;
    meetingLink?: string | null;
}
//# sourceMappingURL=SessionInfoDTO.d.ts.map