import { UsageRecordResponseDTO } from '../dto/usage/UsageRecordResponseDTO';
import { UsageRecord } from '../../domain/entities/UsageRecord';
import { IUsageRecordMapper } from './interfaces/IUsageRecordMapper';
export declare class UsageRecordMapper implements IUsageRecordMapper {
    /**
     * Map UsageRecord entity to UsageRecordResponseDTO with computed fields
     */
    toDTO(usageRecord: UsageRecord): UsageRecordResponseDTO;
    /**
     * Map array of UsageRecord entities to DTOs
     */
    toDTOArray(usageRecords: UsageRecord[]): UsageRecordResponseDTO[];
}
//# sourceMappingURL=UsageRecordMapper.d.ts.map