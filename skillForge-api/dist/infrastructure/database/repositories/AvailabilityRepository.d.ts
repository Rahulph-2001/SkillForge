import { Database } from '../Database';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
export declare class PrismaAvailabilityRepository implements IAvailabilityRepository {
    private readonly database;
    constructor(database: Database);
    findByProviderId(providerId: string): Promise<ProviderAvailability | null>;
    findByProviderIds(providerIds: string[]): Promise<ProviderAvailability[]>;
    create(availability: ProviderAvailability): Promise<ProviderAvailability>;
    update(providerId: string, availability: Partial<ProviderAvailability>): Promise<ProviderAvailability>;
    private mapToEntity;
}
//# sourceMappingURL=AvailabilityRepository.d.ts.map