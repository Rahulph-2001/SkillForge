import { SystemSettings } from '../entities/SystemSettings';

export interface ISystemSettingsRepository {
    get(key: string): Promise<SystemSettings | null>;
    set(key: string, value: string, updatedBy?: string): Promise<SystemSettings>;
}
