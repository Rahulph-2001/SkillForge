import { injectable } from 'inversify';
import { SystemSettings } from '../../domain/entities/SystemSettings';
import { SystemSettingsResponseDTO } from '../dto/settings/SystemSettingsResponseDTO';
import { ISystemSettingsMapper } from './interfaces/ISystemSettingsMapper';

@injectable()
export class SystemSettingsMapper implements ISystemSettingsMapper {
    toResponseDTO(settings: SystemSettings): SystemSettingsResponseDTO {
        return {
            id: settings.id,
            key: settings.key,
            value: settings.value,
            description: settings.description,
            updatedBy: settings.updatedBy,
            updatedAt: settings.updatedAt,
        };
    }
}
