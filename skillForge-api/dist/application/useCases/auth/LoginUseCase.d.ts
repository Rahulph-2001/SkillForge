import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { LoginDTO } from '../../dto/auth/LoginDTO';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { LoginResponseDTO } from '../../dto/auth/LoginResponseDTO';
import { ILoginUseCase } from './interfaces/ILoginUseCase';
export declare class LoginUseCase implements ILoginUseCase {
    private userRepository;
    private passwordService;
    private jwtService;
    private userDTOMapper;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService, jwtService: IJWTService, userDTOMapper: IUserDTOMapper);
    execute(request: LoginDTO, ipAddress?: string): Promise<LoginResponseDTO>;
}
//# sourceMappingURL=LoginUseCase.d.ts.map