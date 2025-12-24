import { PrismaClient } from '@prisma/client';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { UserSubscription } from '../../../domain/entities/UserSubscription';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';
export declare class PrismaUserSubscriptionRepository implements IUserSubscriptionRepository {
    private prisma;
    constructor(prisma: PrismaClient);
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
}
//# sourceMappingURL=PrismaUserSubscriptionRepository.d.ts.map