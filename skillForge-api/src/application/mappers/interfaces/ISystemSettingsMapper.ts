import { type SystemSettings } from '../../../domain/entities/SystemSettings';
import { type SystemSettingsResponseDTO } from '../../dto/settings/SystemSettingsResponseDTO';

export interface ISystemSettingsMapper {
    toResponseDTO(settings: SystemSettings): SystemSettingsResponseDTO;
}
