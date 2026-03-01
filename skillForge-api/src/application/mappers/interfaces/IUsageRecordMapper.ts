import { type UsageRecord } from '../../../domain/entities/UsageRecord';
import { type UsageRecordResponseDTO } from '../../dto/usage/UsageRecordResponseDTO';

export interface IUsageRecordMapper {
  toDTO(usageRecord: UsageRecord): UsageRecordResponseDTO;
  toDTOArray(usageRecords: UsageRecord[]): UsageRecordResponseDTO[];
}

