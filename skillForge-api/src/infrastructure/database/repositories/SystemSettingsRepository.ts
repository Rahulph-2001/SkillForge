import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { ISystemSettingsRepository } from '../../../domain/repositories/ISystemSettingsRepository';
import { SystemSettings } from '../../../domain/entities/SystemSettings';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    private toDomain(data: Record<string, unknown>): SystemSettings {
        return new SystemSettings({
            id: data.id as string | undefined,
            key: data.key as string,
            value: data.value as string,
            description: data.description as string | null | undefined,
            updatedBy: data.updatedBy as string | null | undefined,
            updatedAt: data.updatedAt as Date | undefined,
        });
    }
}
