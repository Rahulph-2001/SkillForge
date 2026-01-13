import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IJWTService } from '../../../domain/services/IJWTService';
import { Profile } from 'passport-google-oauth20';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { IGoogleAuthUseCase, GoogleAuthResponseDTO } from './interfaces/IGoogleAuthUseCase';
export declare class GoogleAuthUseCase implements IGoogleAuthUseCase {
    private userRepository;
    private jwtService;
    private userDTOMapper;
    constructor(userRepository: IUserRepository, jwtService: IJWTService, userDTOMapper: IUserDTOMapper);
    execute(googleProfile: Profile): Promise<GoogleAuthResponseDTO>;
    private extractFullName;
    private generateSecurePasswordHash;
}
//# sourceMappingURL=GoogleAuthUseCase.d.ts.map