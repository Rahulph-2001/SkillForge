import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetProviderProfileUseCase } from './interfaces/IGetProviderProfileUseCase';
import { ProviderProfileResponseDTO } from '../../dto/user/ProviderProfileResponseDTO';
export declare class GetProviderProfileUseCase implements IGetProviderProfileUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(userId: string): Promise<ProviderProfileResponseDTO>;
}
//# sourceMappingURL=GetProviderProfileUseCase.d.ts.map