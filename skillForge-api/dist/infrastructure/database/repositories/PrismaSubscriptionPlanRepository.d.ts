import { Database } from '../Database';
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { ISubscriptionPlanRepository, SubscriptionStats } from '../../../domain/repositories/ISubscriptionPlanRepository';
export declare class PrismaSubscriptionPlanRepository implements ISubscriptionPlanRepository {
    private readonly prisma;
    constructor(db: Database);
    findAll(): Promise<SubscriptionPlan[]>;
    findById(id: string): Promise<SubscriptionPlan | null>;
    findByName(name: string): Promise<SubscriptionPlan | null>;
    create(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
    update(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
    delete(id: string): Promise<void>;
    getStats(): Promise<SubscriptionStats>;
    nameExists(name: string, excludePlanId?: string): Promise<boolean>;
    /**
     * Convert Prisma model to Domain entity
     */
    private toDomain;
}
//# sourceMappingURL=PrismaSubscriptionPlanRepository.d.ts.map