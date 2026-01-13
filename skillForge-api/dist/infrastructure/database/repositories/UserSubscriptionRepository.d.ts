import { Database } from '../Database';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { UserSubscription } from '../../../domain/entities/UserSubscription';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';
import { BaseRepository } from '../BaseRepository';
export declare class PrismaUserSubscriptionRepository extends BaseRepository<UserSubscription> implements IUserSubscriptionRepository {
    constructor(db: Database);
    create(subscription: UserSubscription): Promise<UserSubscription>;
    findById(id: string): Promise<UserSubscription | null>;
    findByUserId(userId: string): Promise<UserSubscription | null>;
    findByPlanId(planId: string): Promise<UserSubscription[]>;
    findByStatus(status: SubscriptionStatus): Promise<UserSubscription[]>;
    findExpiring(days: number): Promise<UserSubscription[]>;
    update(subscription: UserSubscription): Promise<UserSubscription>;
    delete(id: string): Promise<void>;
    countActiveByPlanId(planId: string): Promise<number>;
    findEndingInPeriod(startDate: Date, endDate: Date): Promise<UserSubscription[]>;
    findExpiredActiveSubscriptions(date: Date): Promise<UserSubscription[]>;
}
//# sourceMappingURL=UserSubscriptionRepository.d.ts.map