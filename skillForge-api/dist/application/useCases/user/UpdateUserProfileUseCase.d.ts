import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { IUpdateUserProfileUseCase, UpdateUserProfileDTO, UpdatedProfileResponse } from './interfaces/IUpdateUserProfileUseCase';
export declare class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    private readonly userRepository;
    private readonly storageService;
    constructor(userRepository: IUserRepository, storageService: IStorageService);
    execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse>;
}
//# sourceMappingURL=UpdateUserProfileUseCase.d.ts.map