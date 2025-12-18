import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { AdminLoginDTO } from '../../dto/auth/AdminLoginDTO';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { UserResponseDTO } from '../../dto/auth/UserResponseDTO';
export interface AdminLoginResponse {
    user: UserResponseDTO;
    token: string;
    refreshToken: string;
}
export declare class AdminLoginUseCase {
    private userRepository;
    private passwordService;
    private jwtService;
    private userDTOMapper;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, jwtService: IJWTService, userDTOMapper: IUserDTOMapper);
    execute(request: AdminLoginDTO, ipAddress?: string): Promise<AdminLoginResponse>;
}
//# sourceMappingURL=AdminLoginUseCase.d.ts.map