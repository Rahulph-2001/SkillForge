import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IListCommunitiesUseCase } from './interfaces/IListCommunitiesUseCase';
import { ListCommunitiesRequestDTO } from '../../dto/admin/ListCommunitiesRequestDTO';
import { ListCommunitiesResponseDTO } from '../../dto/admin/ListCommunitiesResponseDTO';
export declare class ListCommunitiesUseCase implements IListCommunitiesUseCase {
    private readonly userRepository;
    private readonly communityRepository;
    private readonly communityMapper;
    private readonly paginationService;
    constructor(userRepository: IUserRepository, communityRepository: ICommunityRepository, communityMapper: ICommunityMapper, paginationService: IPaginationService);
    execute(request: ListCommunitiesRequestDTO): Promise<ListCommunitiesResponseDTO>;
}
//# sourceMappingURL=ListCommunitiesUseCase.d.ts.map