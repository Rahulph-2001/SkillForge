import { SubscriptionPlan } from '../entities/SubscriptionPlan';

export interface SubscriptionStats {
  totalRevenue: number;
  monthlyRecurring: number;
  activeSubscriptions: number;
  paidUsers: number;
  freeUsers: number;
}

export interface ISubscriptionPlanRepository {
  findAll(): Promise<SubscriptionPlan[]>;

  findWithPagination(filters: {
    page: number;
    limit: number;
    isActive?: boolean;
  }): Promise<{
    plans: SubscriptionPlan[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  findById(id: string): Promise<SubscriptionPlan | null>;

  findByName(name: string): Promise<SubscriptionPlan | null>;

  create(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  update(plan: SubscriptionPlan): Promise<SubscriptionPlan>;

  delete(id: string): Promise<void>;

  getStats(): Promise<SubscriptionStats>;

  nameExists(name: string, excludePlanId?: string): Promise<boolean>;
}