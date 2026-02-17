import { injectable, inject } from 'inversify';
import { Database } from '../Database';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { UserSubscription } from '../../../domain/entities/UserSubscription';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';
import { TYPES } from '../../di/types';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class PrismaUserSubscriptionRepository extends BaseRepository<UserSubscription> implements IUserSubscriptionRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'userSubscription');
    }

    async create(subscription: UserSubscription): Promise<UserSubscription> {
        const data = await this.prisma.userSubscription.create({
            data: {
                userId: subscription.userId,
                planId: subscription.planId,
                status: subscription.status as any,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAt: subscription.cancelAt,
                canceledAt: subscription.canceledAt,
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
            },
        });

        return UserSubscription.fromJSON(data);
    }

    async findById(id: string): Promise<UserSubscription | null> {
        const data = await this.prisma.userSubscription.findUnique({
            where: { id },
        });

        return data ? UserSubscription.fromJSON(data) : null;
    }

    async findByUserId(userId: string): Promise<UserSubscription | null> {
        const data = await this.prisma.userSubscription.findUnique({
            where: { userId },
        });

        return data ? UserSubscription.fromJSON(data) : null;
    }

    async findByPlanId(planId: string): Promise<UserSubscription[]> {
        const data = await this.prisma.userSubscription.findMany({
            where: { planId },
        });

        return data.map((item: any) => UserSubscription.fromJSON(item));
    }

    async findByStatus(status: SubscriptionStatus): Promise<UserSubscription[]> {
        const data = await this.prisma.userSubscription.findMany({
            where: { status: status as any },
        });

        return data.map((item: any) => UserSubscription.fromJSON(item));
    }

    async findExpiring(days: number): Promise<UserSubscription[]> {
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);

        const data = await this.prisma.userSubscription.findMany({
            where: {
                currentPeriodEnd: {
                    gte: now,
                    lte: expiryDate,
                },
                status: {
                    in: ['ACTIVE', 'TRIALING'] as any[],
                },
            },
        });

        return data.map((item) => UserSubscription.fromJSON(item));
    }

    async update(subscription: UserSubscription): Promise<UserSubscription> {
        const data = await this.prisma.userSubscription.update({
            where: { id: subscription.id },
            data: {
                planId: subscription.planId,
                status: subscription.status as any,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAt: subscription.cancelAt ?? null,
                canceledAt: subscription.canceledAt ?? null,
                trialStart: subscription.trialStart ?? null,
                trialEnd: subscription.trialEnd ?? null,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
                updatedAt: subscription.updatedAt,
            },
        });

        return UserSubscription.fromJSON(data);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.userSubscription.delete({
            where: { id },
        });
    }

    async countActiveByPlanId(planId: string): Promise<number> {
        return await this.prisma.userSubscription.count({
            where: {
                planId,
                status: {
                    in: ['ACTIVE', 'TRIALING'] as any[],
                },
            },
        });
    }

    async findEndingInPeriod(startDate: Date, endDate: Date): Promise<UserSubscription[]> {
        const data = await this.prisma.userSubscription.findMany({
            where: {
                currentPeriodEnd: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        return data.map((item) => UserSubscription.fromJSON(item));
    }

    async findExpiredActiveSubscriptions(date: Date): Promise<UserSubscription[]> {
        const data = await this.prisma.userSubscription.findMany({
            where: {
                currentPeriodEnd: {
                    lt: date,
                },
                status: {
                    in: ['ACTIVE', 'TRIALING'] as any[],
                },
            },
        });

        return data.map((item: any) => UserSubscription.fromJSON(item));
    }
}