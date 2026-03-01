import { type ProviderAvailability } from '../../../../domain/entities/ProviderAvailability';

export interface IUpdateProviderAvailabilityUseCase {
  execute(providerId: string, data: Partial<ProviderAvailability>): Promise<ProviderAvailability>;
}

