import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISuspendUserUseCase } from './interfaces/ISuspendUserUseCase';
import { SuspendUserRequestDTO } from '../../dto/admin/SuspendUserRequestDTO';
import { SuspendUserResponseDTO } from '../../dto/admin/SuspendUserResponseDTO';
export declare class SuspendUserUseCase implements ISuspendUserUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(request: SuspendUserRequestDTO): Promise<SuspendUserResponseDTO>;
}
//# sourceMappingURL=SuspendUserUseCase.d.ts.map