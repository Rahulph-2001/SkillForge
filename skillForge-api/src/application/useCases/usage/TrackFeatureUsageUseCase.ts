import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { TrackUsageDTO } from '../../dto/usage/TrackUsageDTO';
import { UsageRecordResponseDTO } from '../../dto/usage/UsageRecordResponseDTO';
import { NotFoundError, ConflictError } from '../../../domain/errors/AppError';

export interface ITrackFeatureUsageUseCase {
    execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO>;
}

@injectable()
export class TrackFeatureUsageUseCase implements ITrackFeatureUsageUseCase {
    constructor(
        @inject(TYPES.IUsageRecordRepository) private usageRepository: IUsageRecordRepository,
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository
    ) { }

    async execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO> {
        // Verify subscription exists and is active
        const subscription = await this.subscriptionRepository.findById(dto.subscriptionId);
        if (!subscription) {
            throw new NotFoundError('Subscription not found');
        }

        if (!subscription.isActive()) {
            throw new ConflictError('Subscription is not active');
        }

        // Get or create usage record for current period
        const usageRecord = await this.usageRepository.getOrCreate(
            dto.subscriptionId,
            dto.featureKey,
            undefined, // Limit will be set by the repository if needed
            subscription.currentPeriodStart,
            subscription.currentPeriodEnd
        );

        // Check if limit would be exceeded
        if (usageRecord.limitValue !== undefined) {
            const newCount = usageRecord.usageCount + dto.incrementBy;
            if (newCount > usageRecord.limitValue) {
                throw new ConflictError(
                    `Feature usage limit exceeded. Current: ${usageRecord.usageCount}, Limit: ${usageRecord.limitValue}, Attempting to add: ${dto.incrementBy}`
                );
            }
        }

        // Increment usage
        usageRecord.incrementUsage(dto.incrementBy);

        // Save updated record
        const updated = await this.usageRepository.update(usageRecord);

        // Return DTO
        return {
            id: updated.id,
            subscriptionId: updated.subscriptionId,
            featureKey: updated.featureKey,
            usageCount: updated.usageCount,
            limitValue: updated.limitValue,
            remainingUsage: updated.getRemainingUsage(),
            usagePercentage: updated.getUsagePercentage(),
            hasReachedLimit: updated.hasReachedLimit(),
            periodStart: updated.periodStart,
            periodEnd: updated.periodEnd,
            isPeriodActive: updated.isPeriodActive(),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }
}
