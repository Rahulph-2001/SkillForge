import { Database } from '../Database';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
import { BaseRepository } from '../BaseRepository';
export declare class PrismaAvailabilityRepository extends BaseRepository<ProviderAvailability> implements IAvailabilityRepository {
    constructor(db: Database);
    findByProviderId(providerId: string): Promise<ProviderAvailability | null>;
    findByProviderIds(providerIds: string[]): Promise<ProviderAvailability[]>;
    create(availability: ProviderAvailability): Promise<ProviderAvailability>;
    update(providerId: string, availability: Partial<ProviderAvailability>): Promise<ProviderAvailability>;
    private mapToEntity;
}
//# sourceMappingURL=AvailabilityRepository.d.ts.map