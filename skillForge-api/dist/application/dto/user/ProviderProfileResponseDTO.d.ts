export interface SkillSummary {
    id: string;
    title: string;
    category: string;
    level: string;
}
export interface ProviderProfileResponseDTO {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    rating: number | null;
    reviewCount: number;
    totalSessionsCompleted: number;
    memberSince: Date;
    verification: {
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isIdentityVerified: boolean;
    };
    skillsOffered: SkillSummary[];
}
//# sourceMappingURL=ProviderProfileResponseDTO.d.ts.map