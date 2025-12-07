import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IJWTService } from '../../../domain/services/IJWTService';
import { Profile } from 'passport-google-oauth20';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { UserResponseDTO } from '../../dto/auth/UserResponseDTO';
export interface GoogleAuthResponse {
    user: UserResponseDTO;
    token: string;
    refreshToken: string;
    isNewUser: boolean;
}
export declare class GoogleAuthUseCase {
    private userRepository;
    private jwtService;
    private userDTOMapper;
    constructor(userRepository: IUserRepository, jwtService: IJWTService, userDTOMapper: IUserDTOMapper);
    execute(googleProfile: Profile): Promise<GoogleAuthResponse>;
    private extractFullName;
    private generateSecurePasswordHash;
}
//# sourceMappingURL=GoogleAuthUseCase.d.ts.map