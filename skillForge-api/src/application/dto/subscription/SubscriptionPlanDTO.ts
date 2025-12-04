export interface SubscriptionFeatureDTO {
  id: string;
  name: string;
}

export interface SubscriptionPlanDTO {
  id: string;
  name: string;
  price: number;
  projectPosts: number | null;
  communityPosts: number | null;
  features: SubscriptionFeatureDTO[];
  badge: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
