import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IDeleteCommunityUseCase } from './interfaces/IDeleteCommunityUseCase';
import { DeleteCommunityRequestDTO } from '../../dto/admin/DeleteCommunityRequestDTO';
/**
 * Delete Community Use Case (Admin)
 *
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community deletion logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 *
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
export declare class DeleteCommunityUseCase implements IDeleteCommunityUseCase {
    private readonly userRepository;
    private readonly communityRepository;
    constructor(userRepository: IUserRepository, communityRepository: ICommunityRepository);
    execute(request: DeleteCommunityRequestDTO): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=DeleteCommunityUseCase.d.ts.map