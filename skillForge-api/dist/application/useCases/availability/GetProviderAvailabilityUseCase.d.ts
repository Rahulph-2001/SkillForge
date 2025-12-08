import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
export declare class GetProviderAvailabilityUseCase {
    private readonly availabilityRepository;
    constructor(availabilityRepository: IAvailabilityRepository);
    execute(providerId: string): Promise<ProviderAvailability>;
}
//# sourceMappingURL=GetProviderAvailabilityUseCase.d.ts.map