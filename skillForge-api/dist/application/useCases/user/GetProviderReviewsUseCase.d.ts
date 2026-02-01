import { IGetProviderReviewsUseCase } from './interfaces/IGetProviderReviewsUseCase';
import { ProviderReviewResponseDTO } from '../../dto/user/ProviderReviewResponseDTO';
import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
export declare class GetProviderReviewsUseCase implements IGetProviderReviewsUseCase {
    private readonly reviewRepository;
    private readonly userRepository;
    private readonly skillRepository;
    constructor(reviewRepository: IReviewRepository, userRepository: IUserRepository, skillRepository: ISkillRepository);
    execute(userId: string): Promise<ProviderReviewResponseDTO[]>;
}
//# sourceMappingURL=GetProviderReviewsUseCase.d.ts.map