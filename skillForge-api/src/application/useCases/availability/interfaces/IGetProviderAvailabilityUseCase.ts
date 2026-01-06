import { ProviderAvailability } from '../../../../domain/entities/ProviderAvailability';

export interface IGetProviderAvailabilityUseCase {
  execute(providerId: string): Promise<ProviderAvailability>;
}

