import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IBlockCommunityUseCase } from './interfaces/IBlockCommunityUseCase';
import { BlockCommunityRequestDTO } from '../../dto/admin/BlockCommunityRequestDTO';
/**
 * Block Community Use Case (Admin)
 *
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community blocking logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 *
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
export declare class BlockCommunityUseCase implements IBlockCommunityUseCase {
    private readonly userRepository;
    private readonly communityRepository;
    constructor(userRepository: IUserRepository, communityRepository: ICommunityRepository);
    execute(request: BlockCommunityRequestDTO): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=BlockCommunityUseCase.d.ts.map