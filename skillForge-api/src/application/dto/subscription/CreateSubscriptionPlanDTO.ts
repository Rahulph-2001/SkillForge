

export interface FeatureDTO {
  id?: string; // Optional for updates, auto-generated for new features
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
