import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListUsersUseCase } from './interfaces/IListUsersUseCase';
import { ListUsersRequestDTO } from '../../dto/admin/ListUsersRequestDTO';
import { ListUsersResponseDTO } from '../../dto/admin/ListUsersResponseDTO';
import { IAdminUserDTOMapper } from '../../mappers/interfaces/IAdminUserDTOMapper';
import { IPaginationService } from '../../../domain/services/IPaginationService';
export declare class ListUsersUseCase implements IListUsersUseCase {
    private userRepository;
    private userMapper;
    private paginationService;
    constructor(userRepository: IUserRepository, userMapper: IAdminUserDTOMapper, paginationService: IPaginationService);
    execute(request: ListUsersRequestDTO): Promise<ListUsersResponseDTO>;
}
//# sourceMappingURL=ListUsersUseCase.d.ts.map