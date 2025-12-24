import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability, WeeklySchedule, BlockedDate } from '../../../domain/entities/ProviderAvailability';

@injectable()
export class PrismaAvailabilityRepository implements IAvailabilityRepository {
    constructor(
        @inject(TYPES.Database) private readonly database: Database
    ) { }

    async findByProviderId(providerId: string): Promise<ProviderAvailability | null> {
        const data = await this.database.getClient().providerAvailability.findUnique({
            where: { providerId },
        });

        if (!data) return null;

        const entity = this.mapToEntity(data);
        console.log('[PrismaAvailabilityRepository] findByProviderId', providerId, 'keys', Object.keys(entity.weeklySchedule || {}));
        return entity;
    }

    async findByProviderIds(providerIds: string[]): Promise<ProviderAvailability[]> {
        const data = await this.database.getClient().providerAvailability.findMany({
            where: {
                providerId: { in: providerIds }
            }
        });

        return data.map(item => this.mapToEntity(item));
    }

    async create(availability: ProviderAvailability): Promise<ProviderAvailability> {
        const data = await this.database.getClient().providerAvailability.create({
            data: {
                providerId: availability.providerId,
                weeklySchedule: availability.weeklySchedule as any,
                timezone: availability.timezone,
                bufferTime: availability.bufferTime,
                minAdvanceBooking: availability.minAdvanceBooking,
                maxAdvanceBooking: availability.maxAdvanceBooking,
                autoAccept: availability.autoAccept,
                blockedDates: availability.blockedDates as any,
                maxSessionsPerDay: availability.maxSessionsPerDay,
            },
        });

        const entity = this.mapToEntity(data);
        console.log('[PrismaAvailabilityRepository] create', availability.providerId, 'keys', Object.keys(entity.weeklySchedule || {}));
        return entity;
    }

    async update(providerId: string, availability: Partial<ProviderAvailability>): Promise<ProviderAvailability> {
        const data = await this.database.getClient().providerAvailability.update({
            where: { providerId },
            data: {
                weeklySchedule: availability.weeklySchedule as any,
                timezone: availability.timezone,
                bufferTime: availability.bufferTime,
                minAdvanceBooking: availability.minAdvanceBooking,
                maxAdvanceBooking: availability.maxAdvanceBooking,
                autoAccept: availability.autoAccept,
                blockedDates: availability.blockedDates as any,
                maxSessionsPerDay: availability.maxSessionsPerDay,
            },
        });

        const entity = this.mapToEntity(data);
        console.log('[PrismaAvailabilityRepository] update', providerId, 'keys', Object.keys(entity.weeklySchedule || {}));
        return entity;
    }

    private mapToEntity(data: any): ProviderAvailability {
        return new ProviderAvailability(
            data.id,
            data.providerId,
            (data.weeklySchedule || {}) as WeeklySchedule,
            data.timezone,
            data.bufferTime,
            data.minAdvanceBooking,
            data.maxAdvanceBooking,
            data.autoAccept,
            data.blockedDates as BlockedDate[],
            data.maxSessionsPerDay,
            data.createdAt,
            data.updatedAt
        );
    }
}
