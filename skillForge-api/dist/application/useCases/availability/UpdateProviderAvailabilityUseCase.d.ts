import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
export declare class UpdateProviderAvailabilityUseCase {
    private readonly availabilityRepository;
    constructor(availabilityRepository: IAvailabilityRepository);
    execute(providerId: string, data: Partial<ProviderAvailability>): Promise<ProviderAvailability>;
}
//# sourceMappingURL=UpdateProviderAvailabilityUseCase.d.ts.map