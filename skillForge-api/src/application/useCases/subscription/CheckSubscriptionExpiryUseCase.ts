import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICheckSubscriptionExpiryUseCase } from './interfaces/ICheckSubscriptionExpiryUseCase';

@injectable()
export class CheckSubscriptionExpiryUseCase implements ICheckSubscriptionExpiryUseCase {
    constructor(
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) { }

    async execute(): Promise<void> {
        const now = new Date();
        const expiredSubscriptions = await this.subscriptionRepository.findExpiredActiveSubscriptions(now);

        if (expiredSubscriptions.length === 0) {
            return;
        }

        for (const subscription of expiredSubscriptions) {
            try {
                // Skip lifetime subscriptions (they have far future end dates)
                // The query should already filter these out, but double-check
                const yearsUntilExpiry = (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
                if (yearsUntilExpiry > 50) {
                    continue; // Likely a lifetime subscription
                }

                // Expire the subscription
                subscription.expire();
                await this.subscriptionRepository.update(subscription);

                // Update User entity to reflect expired subscription
                const user = await this.userRepository.findById(subscription.userId);
                if (user) {
                    user.deactivateSubscription();
                    await this.userRepository.update(user);
                }

            } catch (error) {
                console.error(`[CheckSubscriptionExpiryUseCase] Failed to expire subscription ${subscription.id}:`, error);
            }
        }
    }
}
