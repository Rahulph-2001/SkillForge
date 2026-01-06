import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { UserSubscription } from '../../../domain/entities/UserSubscription';
import { ActivateSubscriptionRequestDTO } from '../../dto/subscription/ActivateSubscriptionDTO';
import { SubscriptionActivationResponseDTO } from '../../dto/subscription/SubscriptionActivationResponseDTO';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ConflictError } from '../../../domain/errors/AppError';
import { SubscriptionStatus, BillingInterval } from '../../../domain/enums/SubscriptionEnums';
import { IActivateSubscriptionUseCase } from './interfaces/IActivateSubscriptionUseCase';

@injectable()
export class ActivateSubscriptionUseCase implements IActivateSubscriptionUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
        @inject(TYPES.ISubscriptionPlanRepository) private planRepository: ISubscriptionPlanRepository
    ) { }

    async execute(dto: ActivateSubscriptionRequestDTO): Promise<SubscriptionActivationResponseDTO> {
        // 1. Fetch user
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // 2. Fetch subscription plan
        const plan = await this.planRepository.findById(dto.planId);
        if (!plan) {
            throw new NotFoundError('Subscription plan not found');
        }

        // 3. Check for existing subscription
        const existingSubscription = await this.subscriptionRepository.findByUserId(dto.userId);

        // 4. Calculate new period dates
        const now = new Date();
        let periodStart = now;
        let periodEnd = new Date(now);

        // 5. Determine start/end dates based on existing subscription status
        if (existingSubscription && existingSubscription.isActive()) {
            if (existingSubscription.planId === dto.planId) {
                // CASE: RE-SUBSCRIBE / EXTEND (Same Plan) -> Industrial Standard: Extend from current end date
                console.log('[ActivateSubscriptionUseCase] Extending existing subscription');
                periodStart = existingSubscription.currentPeriodStart; // Keep original start

                // If already expired (but marked active?), use now. But isActive() checks expiry usually. 
                // Let's ensure we extend from currentPeriodEnd if it's in the future, else from now.
                const currentEnd = existingSubscription.currentPeriodEnd > now ? existingSubscription.currentPeriodEnd : now;
                periodEnd = new Date(currentEnd);
            } else {
                // CASE: UPGRADE / DOWNGRADE -> Industrial Standard: Immediate switch
                console.log('[ActivateSubscriptionUseCase] Switching plan (Immediate)');
                // Period starts now.
                // NOTE: In a real Stripe integration, we'd handle proration here. 
                // For now, we just reset the cycle.
            }
        }

        // Calculate end date based on billing interval
        switch (dto.billingInterval) {
            case BillingInterval.MONTHLY:
                periodEnd.setMonth(periodEnd.getMonth() + 1);
                break;
            case BillingInterval.QUARTERLY:
                periodEnd.setMonth(periodEnd.getMonth() + 3);
                break;
            case BillingInterval.YEARLY:
                periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                break;
            case BillingInterval.LIFETIME:
                periodEnd.setFullYear(periodEnd.getFullYear() + 100);
                break;
        }

        // 6. Persist Subscription
        let subscription: UserSubscription;

        if (existingSubscription) {
            // Update existing
            existingSubscription.updatePlan(dto.planId, periodStart, periodEnd);
            // Ensure canceledAt is cleared if it was set (reactivation)
            if (existingSubscription.canceledAt) {
                existingSubscription.reactivate();
            }
            subscription = await this.subscriptionRepository.update(existingSubscription);
        } else {
            // Create new
            subscription = new UserSubscription({
                id: uuidv4(),
                userId: dto.userId,
                planId: dto.planId,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                createdAt: now,
                updatedAt: now,
            });
            subscription = await this.subscriptionRepository.create(subscription);
        }

        // 7. Update User Entity (Legacy/Sync)
        const planType = this.mapBadgeToSubscriptionPlan(plan.badge);
        user.activateSubscription(planType, periodEnd, periodStart, true); // Auto-renew ON
        await this.userRepository.update(user);

        return {
            subscriptionId: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            planName: plan.name,
            planBadge: plan.badge,
            status: subscription.status,
            validUntil: subscription.currentPeriodEnd,
            startedAt: subscription.currentPeriodStart,
        };
    }

    private mapBadgeToSubscriptionPlan(badge: string): 'free' | 'starter' | 'professional' | 'enterprise' {
        const lowerBadge = badge.toLowerCase();
        if (lowerBadge === 'free') return 'free';
        if (lowerBadge === 'starter') return 'starter';
        if (lowerBadge === 'professional') return 'professional';
        if (lowerBadge === 'enterprise') return 'enterprise';
        return 'free';
    }
}
