import { type TrackUsageDTO } from '../../../dto/usage/TrackUsageDTO';
import { type UsageRecordResponseDTO } from '../../../dto/usage/UsageRecordResponseDTO';

export interface ITrackFeatureUsageUseCase {
    execute(dto: TrackUsageDTO): Promise<UsageRecordResponseDTO>;
}

