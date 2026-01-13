import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUsageRecordMapper } from '../../mappers/interfaces/IUsageRecordMapper';
import { TrackUsageDTO } from '../../dto/usage/TrackUsageDTO';
import { UsageRecordResponseDTO } from '../../dto/usage/UsageRecordResponseDTO';
import { ITrackFeatureUsageUseCase } from './interfaces/ITrackFeatureUsageUseCase';
export declare class TrackFeatureUsageUseCase implements ITrackFeatureUsageUseCase {
    private usageRepository;
    private subscriptionRepository;
    private usageRecordMapper;
    constructor(usageRepository: IUsageRecordRepository, subscriptionRepository: IUserSubscriptionRepository, usageRecordMapper: IUsageRecordMapper);
    execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO>;
}
//# sourceMappingURL=TrackFeatureUsageUseCase.d.ts.map