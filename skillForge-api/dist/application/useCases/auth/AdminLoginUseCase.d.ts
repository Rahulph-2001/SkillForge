import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { AdminLoginDTO } from '../../dto/auth/AdminLoginDTO';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { IAdminLoginUseCase, AdminLoginResponseDTO } from './interfaces/IAdminLoginUseCase';
export declare class AdminLoginUseCase implements IAdminLoginUseCase {
    private userRepository;
    private passwordService;
    private jwtService;
    private userDTOMapper;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, jwtService: IJWTService, userDTOMapper: IUserDTOMapper);
    execute(request: AdminLoginDTO, ipAddress?: string): Promise<AdminLoginResponseDTO>;
}
//# sourceMappingURL=AdminLoginUseCase.d.ts.map