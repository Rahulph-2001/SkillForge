import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IGetUserProfileUseCase, UserProfileDTO } from './interfaces/IGetUserProfileUseCase';
export declare class GetUserProfileUseCase implements IGetUserProfileUseCase {
    private readonly userRepository;
    private readonly skillRepository;
    constructor(userRepository: IUserRepository, skillRepository: ISkillRepository);
    execute(userId: string): Promise<UserProfileDTO>;
}
//# sourceMappingURL=GetUserProfileUseCase.d.ts.map