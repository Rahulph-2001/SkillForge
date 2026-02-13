import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { ISystemSettingsRepository } from '../../../domain/repositories/ISystemSettingsRepository';
import { SystemSettings } from '../../../domain/entities/SystemSettings';
import { PrismaClient } from '@prisma/client';

@injectable()
export class SystemSettingsRepository extends BaseRepository<SystemSettings> implements ISystemSettingsRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'systemSettings');
    }

    async get(key: string): Promise<SystemSettings | null> {
        const data = await this.prisma.systemSettings.findUnique({
            where: { key },
        });
        return data ? this.toDomain(data) : null;
    }

    async set(key: string, value: string, updatedBy?: string): Promise<SystemSettings> {
        const data = await this.prisma.systemSettings.upsert({
            where: { key },
            update: {
                value,
                updatedBy,
                updatedAt: new Date(),
            },
            create: {
                key,
                value,
                updatedBy,
            },
        });
        return this.toDomain(data);
    }

    private toDomain(data: any): SystemSettings {
        return new SystemSettings({
            id: data.id,
            key: data.key,
            value: data.value,
            description: data.description,
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
        });
    }
}
