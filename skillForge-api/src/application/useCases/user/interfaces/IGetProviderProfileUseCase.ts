import { ProviderProfileResponseDTO } from '../../../dto/user/ProviderProfileResponseDTO';

export interface IGetProviderProfileUseCase {
  execute(userId: string): Promise<ProviderProfileResponseDTO>;
}

