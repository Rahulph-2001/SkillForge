import { ProviderAvailability } from '../entities/ProviderAvailability';
export interface IAvailabilityRepository {
    findByProviderId(providerId: string): Promise<ProviderAvailability | null>;
    create(availability: ProviderAvailability): Promise<ProviderAvailability>;
    update(providerId: string, availability: Partial<ProviderAvailability>): Promise<ProviderAvailability>;
    findByProviderIds(providerIds: string[]): Promise<ProviderAvailability[]>;
}
//# sourceMappingURL=IAvailabilityRepository.d.ts.map