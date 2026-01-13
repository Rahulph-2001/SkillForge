import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
import { IGetProviderAvailabilityUseCase } from './interfaces/IGetProviderAvailabilityUseCase';
export declare class GetProviderAvailabilityUseCase implements IGetProviderAvailabilityUseCase {
    private readonly availabilityRepository;
    constructor(availabilityRepository: IAvailabilityRepository);
    execute(providerId: string): Promise<ProviderAvailability>;
}
//# sourceMappingURL=GetProviderAvailabilityUseCase.d.ts.map