import { SystemSettings } from '../../../domain/entities/SystemSettings';
import { SystemSettingsResponseDTO } from '../../dto/settings/SystemSettingsResponseDTO';

export interface ISystemSettingsMapper {
    toResponseDTO(settings: SystemSettings): SystemSettingsResponseDTO;
}
