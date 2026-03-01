/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Prisma } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProviderAvailability, WeeklySchedule, BlockedDate } from '../../../domain/entities/ProviderAvailability';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class PrismaAvailabilityRepository extends BaseRepository<ProviderAvailability> implements IAvailabilityRepository {
    constructor(
        @inject(TYPES.Database) db: Database
    ) {
        super(db, 'providerAvailability');
    }

    async findByProviderId(providerId: string): Promise<ProviderAvailability | null> {
        const data = await this.prisma.providerAvailability.findUnique({
            where: { providerId },
        });

        if (!data) return null;

        const entity = this.mapToEntity(data);
        return entity;
    }

    async findByProviderIds(providerIds: string[]): Promise<ProviderAvailability[]> {
        const data = await this.prisma.providerAvailability.findMany({
            where: {
                providerId: { in: providerIds }
            }
        });

        return data.map(item => this.mapToEntity(item));
    }

    async create(availability: ProviderAvailability): Promise<ProviderAvailability> {
        const data = await this.prisma.providerAvailability.create({
            data: {
                providerId: availability.providerId,
                weeklySchedule: availability.weeklySchedule as unknown as Prisma.InputJsonValue,
                timezone: availability.timezone,
                bufferTime: availability.bufferTime,
                minAdvanceBooking: availability.minAdvanceBooking,
                maxAdvanceBooking: availability.maxAdvanceBooking,
                autoAccept: availability.autoAccept,
                blockedDates: availability.blockedDates as unknown as string[],
                maxSessionsPerDay: availability.maxSessionsPerDay,
            },
        });

        const entity = this.mapToEntity(data);
        return entity;
    }

    async update(providerId: string, availability: Partial<ProviderAvailability>): Promise<ProviderAvailability> {
        const data = await this.prisma.providerAvailability.update({
            where: { providerId },
            data: {
                weeklySchedule: availability.weeklySchedule as unknown as Prisma.InputJsonValue,
                timezone: availability.timezone,
                bufferTime: availability.bufferTime,
                minAdvanceBooking: availability.minAdvanceBooking,
                maxAdvanceBooking: availability.maxAdvanceBooking,
                autoAccept: availability.autoAccept,
                blockedDates: availability.blockedDates as unknown as string[],
                maxSessionsPerDay: availability.maxSessionsPerDay,
            },
        });

        const entity = this.mapToEntity(data);
        return entity;
    }

    private mapToEntity(data: Record<string, unknown>): ProviderAvailability {
        return new ProviderAvailability(
            data.id,
            data.providerId as string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (data.weeklySchedule || {}) as any,
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