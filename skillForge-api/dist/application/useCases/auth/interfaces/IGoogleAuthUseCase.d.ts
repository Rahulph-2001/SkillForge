import { Profile } from 'passport-google-oauth20';
import { UserResponseDTO } from '../../../dto/auth/UserResponseDTO';
export interface GoogleAuthResponseDTO {
    user: UserResponseDTO;
    token: string;
    refreshToken: string;
    isNewUser: boolean;
}
export interface IGoogleAuthUseCase {
    execute(googleProfile: Profile): Promise<GoogleAuthResponseDTO>;
}
//# sourceMappingURL=IGoogleAuthUseCase.d.ts.map