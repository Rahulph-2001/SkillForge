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
}
