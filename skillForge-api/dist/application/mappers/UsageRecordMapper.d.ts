import { UsageRecordResponseDTO } from '../dto/usage/UsageRecordResponseDTO';
import { UsageRecord } from '../../domain/entities/UsageRecord';
export declare class UsageRecordMapper {
    /**
     * Map UsageRecord entity to UsageRecordResponseDTO with computed fields
     */
    static toDTO(usageRecord: UsageRecord): UsageRecordResponseDTO;
    /**
     * Map array of UsageRecord entities to DTOs
     */
    static toDTOArray(usageRecords: UsageRecord[]): UsageRecordResponseDTO[];
}
//# sourceMappingURL=UsageRecordMapper.d.ts.map