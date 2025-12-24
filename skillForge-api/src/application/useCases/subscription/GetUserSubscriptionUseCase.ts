import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { UserSubscriptionMapper } from '../../mappers/UserSubscriptionMapper';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';

export interface IGetUserSubscriptionUseCase {
    execute(userId: string): Promise<UserSubscriptionResponseDTO>;
}

@injectable()
export class GetUserSubscriptionUseCase implements IGetUserSubscriptionUseCase {
    constructor(
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
        @inject(TYPES.ISubscriptionPlanRepository) private planRepository: ISubscriptionPlanRepository
    ) { }

    async execute(userId: string): Promise<UserSubscriptionResponseDTO> {
        // Find user's subscription
        const subscription = await this.subscriptionRepository.findByUserId(userId);

        if (!subscription) {
            throw new NotFoundError('User does not have an active subscription');
        }

        // Get plan details
        const plan = await this.planRepository.findById(subscription.planId);

        if (!plan) {
            throw new NotFoundError('Subscription plan not found');
        }

        // Map to DTO with plan name
        return UserSubscriptionMapper.toDTO(subscription, plan.name);
    }
}
