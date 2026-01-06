import { TrackUsageDTO } from '../../../dto/usage/TrackUsageDTO';
import { UsageRecordResponseDTO } from '../../../dto/usage/UsageRecordResponseDTO';

export interface ITrackFeatureUsageUseCase {
    execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO>;
}

