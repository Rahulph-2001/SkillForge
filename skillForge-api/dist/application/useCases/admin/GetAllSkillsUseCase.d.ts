import { PrismaClient } from '@prisma/client';
export interface SkillDTO {
    id: string;
    providerId: string;
    providerName: string;
    providerEmail: string;
    title: string;
    description: string;
    category: string;
    level: string;
    durationHours: number;
    creditsPerHour: number;
    tags: string[];
    imageUrl: string | null;
    templateId: string | null;
    status: string;
    verificationStatus: string | null;
    mcqScore: number | null;
    mcqTotalQuestions: number | null;
    mcqPassingScore: number | null;
    verifiedAt: Date | null;
    rejectionReason: string | null;
    isBlocked: boolean;
    blockedReason: string | null;
    blockedAt: Date | null;
    totalSessions: number;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GetAllSkillsUseCase {
    private prisma;
    constructor(prisma: PrismaClient);
    execute(): Promise<SkillDTO[]>;
}
//# sourceMappingURL=GetAllSkillsUseCase.d.ts.map