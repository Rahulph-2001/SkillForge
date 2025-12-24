import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError, ConflictError } from '../../../domain/errors/AppError';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';

export interface IReactivateSubscriptionUseCase {
    execute(userId: string): Promise<void>;
}

@injectable()
export class ReactivateSubscriptionUseCase implements IReactivateSubscriptionUseCase {
    constructor(
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<void> {
        const subscription = await this.subscriptionRepository.findByUserId(userId);

        if (!subscription) {
            throw new NotFoundError('No active or canceled subscription found');
        }

        // Only allow reactivation if it's scheduled to cancel (has cancelAt endpoint) or canceled but not expired?
        // Actually, "Reactivate" usually means "Undo Cancel" (scheduled cancellation).
        // If it is ALREADY CANCELED (expired) or PAST_DUE, they generally need to Pay (Activate/Extend).
        // So this use case is specifically for "Undo Cancel".

        if (!subscription.willCancelAtPeriodEnd()) {
            throw new ConflictError('Subscription is not scheduled for cancellation');
        }

        // Logic: Clear cancellation flags
        subscription.reactivate();
        // UserSubscription entity's reactivate() method clears canceledAt, cancelAt, and sets status to ACTIVE.

        await this.subscriptionRepository.update(subscription);

        // Sync User Entity
        const user = await this.userRepository.findById(userId);
        if (user) {
            // Update autoRenew to true. We don't change dates.
            // Check User entity method. activateSubscription might be too heavy (sets dates).
            // We might need a generic update or just re-call activate with same dates.
            // user.activateSubscription(plan, end, start, autoRenew=true)

            // We need plan name.
            let planName = 'starter'; // Default fallback, but we should fetch plan or store it.
            // The UserSubscription entity has planId. The User entity has subscription.plan.
            // We can trust existing User entity data if we just want to flip the boolean.

            // However, looking at User entity (viewed previously), it might not have fine-grained setters.
            // activateSubscription overwrites.

            // Let's assume we can re-call activateSubscription with existing user data but autoRenew=true.
            const currentPlan = user.subscriptionPlan;
            const currentEnd = user.subscriptionValidUntil;
            const currentStart = user.subscriptionStartedAt;

            if (currentPlan && currentEnd && currentStart) {
                user.activateSubscription(currentPlan, currentEnd, currentStart, true);
                await this.userRepository.update(user);
            }
        }
    }
}
