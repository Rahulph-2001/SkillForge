import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';

@injectable()
export class GetProviderAvailabilityUseCase {
    constructor(
        @inject(TYPES.IAvailabilityRepository) private readonly availabilityRepository: IAvailabilityRepository
    ) { }

    async execute(providerId: string): Promise<ProviderAvailability> {
        const availability = await this.availabilityRepository.findByProviderId(providerId);

        if (!availability) {
            // Return default availability if not found
            return ProviderAvailability.create(providerId);
        }

        return availability;
    }
}
