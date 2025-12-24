import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { TrackUsageDTO } from '../../dto/usage/TrackUsageDTO';
import { UsageRecordResponseDTO } from '../../dto/usage/UsageRecordResponseDTO';
export interface ITrackFeatureUsageUseCase {
    execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO>;
}
export declare class TrackFeatureUsageUseCase implements ITrackFeatureUsageUseCase {
    private usageRepository;
    private subscriptionRepository;
    constructor(usageRepository: IUsageRecordRepository, subscriptionRepository: IUserSubscriptionRepository);
    execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO>;
}
//# sourceMappingURL=TrackFeatureUsageUseCase.d.ts.map