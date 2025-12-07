import { Database } from '../../../infrastructure/database/Database';
export interface UserProfileDTO {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    credits: number;
    walletBalance: number;
    skillsOffered: number;
    rating: number;
    reviewCount: number;
    totalSessionsCompleted: number;
    memberSince: string;
    subscriptionPlan: string;
    subscriptionValidUntil: string | null;
}
export declare class GetUserProfileUseCase {
    constructor(database: Database);
    private prisma;
    execute(userId: string): Promise<UserProfileDTO>;
}
//# sourceMappingURL=GetUserProfileUseCase.d.ts.map