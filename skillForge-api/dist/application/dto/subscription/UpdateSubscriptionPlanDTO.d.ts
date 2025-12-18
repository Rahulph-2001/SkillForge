import { FeatureDTO } from './CreateSubscriptionPlanDTO';
export interface UpdateSubscriptionPlanDTO {
    planId: string;
    name: string;
    price: number;
    projectPosts: number | null;
    communityPosts: number | null;
    features: FeatureDTO[];
    badge: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    color: string;
}
//# sourceMappingURL=UpdateSubscriptionPlanDTO.d.ts.map