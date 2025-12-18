import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUnsuspendUserUseCase } from './interfaces/IUnsuspendUserUseCase';
import { SuspendUserRequestDTO } from '../../dto/admin/SuspendUserRequestDTO';
import { SuspendUserResponseDTO } from '../../dto/admin/SuspendUserResponseDTO';
export declare class UnsuspendUserUseCase implements IUnsuspendUserUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(request: SuspendUserRequestDTO): Promise<SuspendUserResponseDTO>;
}
//# sourceMappingURL=UnsuspendUserUseCase.d.ts.map