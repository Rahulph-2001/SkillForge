export interface BookingResponseDTO {
    id: string;
    skillId: string;
    skillTitle?: string;
    providerId: string;
    providerName?: string;
    providerAvatar?: string | null;
    learnerId: string;
    learnerName?: string;
    learnerAvatar?: string | null;
    preferredDate: string;
    preferredTime: string;
    duration?: number;
    message: string | null;
    status: string;
    sessionCost: number;
    rescheduleInfo?: {
        newDate: string;
        newTime: string;
        reason: string;
        requestedBy: 'learner' | 'provider';
        requestedAt: Date;
    } | null;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=BookingResponseDTO.d.ts.map