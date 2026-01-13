import { UsageRecord } from '../../../domain/entities/UsageRecord';
import { UsageRecordResponseDTO } from '../../dto/usage/UsageRecordResponseDTO';
export interface IUsageRecordMapper {
    toDTO(usageRecord: UsageRecord): UsageRecordResponseDTO;
    toDTOArray(usageRecords: UsageRecord[]): UsageRecordResponseDTO[];
}
//# sourceMappingURL=IUsageRecordMapper.d.ts.map