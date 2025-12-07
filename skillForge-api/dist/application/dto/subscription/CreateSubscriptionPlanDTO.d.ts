export interface FeatureDTO {
    id?: string;
    name: string;
}
export interface CreateSubscriptionPlanDTO {
    name: string;
    price: number;
    projectPosts: number | null;
    communityPosts: number | null;
    features: FeatureDTO[];
    badge: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    color: string;
}
//# sourceMappingURL=CreateSubscriptionPlanDTO.d.ts.map