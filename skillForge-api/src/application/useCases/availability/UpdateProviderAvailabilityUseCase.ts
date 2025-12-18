import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';

@injectable()
export class UpdateProviderAvailabilityUseCase {
    constructor(
        @inject(TYPES.IAvailabilityRepository) private readonly availabilityRepository: IAvailabilityRepository
    ) { }

    async execute(providerId: string, data: Partial<ProviderAvailability>): Promise<ProviderAvailability> {
        // Industrial Level Validation: Sanitize and Merge Overlapping Slots
        if (data.weeklySchedule) {
            data.weeklySchedule = this.validateAndMergeSchedule(data.weeklySchedule);
        }

        const existing = await this.availabilityRepository.findByProviderId(providerId);

        if (!existing) {
            const newAvailability = ProviderAvailability.create(
                providerId,
                data.weeklySchedule,
                data.timezone,
                data.bufferTime,
                data.minAdvanceBooking,
                data.maxAdvanceBooking,
                data.autoAccept,
                data.blockedDates,
                data.maxSessionsPerDay
            );
            return this.availabilityRepository.create(newAvailability);
        }

        return this.availabilityRepository.update(providerId, data);
    }

    private validateAndMergeSchedule(schedule: any): any {
        const result = { ...schedule };
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        for (const day of days) {
            if (result[day] && result[day].enabled && result[day].slots && result[day].slots.length > 0) {
                result[day].slots = this.mergeSlots(result[day].slots);
            }
        }
        return result;
    }

    private mergeSlots(slots: { start: string; end: string }[]): { start: string; end: string }[] {
        // 1. Convert to minutes for easy comparison
        const timeToMin = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const minToTime = (min: number) => {
            const h = Math.floor(min / 60).toString().padStart(2, '0');
            const m = (min % 60).toString().padStart(2, '0');
            return `${h}:${m}`;
        };

        // 2. Map, Sort by Start Time
        const ranges = slots
            .map(s => ({ start: timeToMin(s.start), end: timeToMin(s.end) }))
            .sort((a, b) => a.start - b.start);

        // 3. Merge Overlaps
        const merged: { start: number; end: number }[] = [];
        for (const current of ranges) {
            if (current.start >= current.end) continue; // Skip invalid slots (e.g. 5pm to 4pm)

            if (merged.length === 0) {
                merged.push(current);
            } else {
                const prev = merged[merged.length - 1];
                // Overlap or Adjacent: Current Start <= Previous End
                if (current.start <= prev.end) {
                    prev.end = Math.max(prev.end, current.end);
                } else {
                    merged.push(current);
                }
            }
        }

        // 4. Convert back
        return merged.map(r => ({ start: minToTime(r.start), end: minToTime(r.end) }));
    }
}
