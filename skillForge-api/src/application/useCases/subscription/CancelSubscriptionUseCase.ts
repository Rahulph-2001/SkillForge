import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserSubscriptionMapper } from '../../mappers/interfaces/IUserSubscriptionMapper';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { NotFoundError, ConflictError } from '../../../domain/errors/AppError';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICancelSubscriptionUseCase } from './interfaces/ICancelSubscriptionUseCase';

@injectable()
export class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
    constructor(
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
        @inject(TYPES.ISubscriptionPlanRepository) private planRepository: ISubscriptionPlanRepository,
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(TYPES.IUserSubscriptionMapper) private userSubscriptionMapper: IUserSubscriptionMapper
    ) { }

    async execute(userId: string, immediate: boolean = false): Promise<UserSubscriptionResponseDTO> {
        // Find user's subscription
        const subscription = await this.subscriptionRepository.findByUserId(userId);

        if (!subscription) {
            throw new NotFoundError('User does not have an active subscription');
        }

        // Check if already canceled
        if (subscription.canceledAt) {
            throw new ConflictError('Subscription is already canceled');
        }

        // Cancel subscription
        if (immediate) {
            subscription.cancelImmediately();
        } else {
            subscription.cancelAtPeriodEnd();
        }

        // Save updated subscription
        const updated = await this.subscriptionRepository.update(subscription);

        // SYNC USER ENTITY
        try {
            const user = await this.userRepository.findById(userId);
            if (user) {
                if (immediate) {
                    // Revert to free immediately
                    user.activateSubscription(
                        'free',
                        new Date(), // valid until now
                        undefined,
                        false // no auto renew
                    );
                } else {
                    // Just turn off auto-renew
                    // We need to keep the current plan and validity
                    // But User entity activateSubscription overwrites everything.
                    // We need a way to just set autoRenew = false.
                    // Or call activateSubscription with existing values but autoRenew=false
                    user.activateSubscription(
                        user.subscriptionPlan,
                        user.subscriptionValidUntil || subscription.currentPeriodEnd,
                        user.subscriptionStartedAt || subscription.currentPeriodStart,
                        false // DISABLE auto-renew
                    );
                }
                await this.userRepository.update(user);
                console.log('[CancelSubscriptionUseCase] Synced user entity subscription data');
            }
        } catch (error) {
            console.error('[CancelSubscriptionUseCase] Failed to sync user entity:', error);
        }

        // Get plan details
        const plan = await this.planRepository.findById(updated.planId);

        // Map to DTO
        return this.userSubscriptionMapper.toDTO(updated, plan?.name);
    }
}
