import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUnblockCommunityUseCase } from './interfaces/IUnblockCommunityUseCase';
import { UnblockCommunityRequestDTO } from '../../dto/admin/UnblockCommunityRequestDTO';
/**
 * Unblock Community Use Case (Admin)
 *
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community unblocking logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 *
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
export declare class UnblockCommunityUseCase implements IUnblockCommunityUseCase {
    private readonly userRepository;
    private readonly communityRepository;
    constructor(userRepository: IUserRepository, communityRepository: ICommunityRepository);
    execute(request: UnblockCommunityRequestDTO): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=UnblockCommunityUseCase.d.ts.map