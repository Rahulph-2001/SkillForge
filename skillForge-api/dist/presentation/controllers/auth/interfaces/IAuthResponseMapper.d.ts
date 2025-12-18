import { UserResponseDTO } from '../../../../application/dto/auth/UserResponseDTO';
import { AuthSuccessResponse } from '../AuthResponseMapper';
export interface IAuthResponseMapper {
    mapRegisterResponse(email: string, expiresAt: string, message: string): AuthSuccessResponse<{
        email: string;
        expiresAt: string;
        message: string;
    }>;
    mapLoginResponse(userResponse: UserResponseDTO, token: string, refreshToken: string): AuthSuccessResponse<{
        user: UserResponseDTO;
        token: string;
        refreshToken: string;
    }>;
    mapVerifyOtpResponse(userResponse: UserResponseDTO, message: string, token: string, refreshToken: string): AuthSuccessResponse<{
        user: UserResponseDTO;
        message: string;
        token: string;
        refreshToken: string;
    }>;
    mapLogoutResponse(): AuthSuccessResponse<{
        message: string;
    }>;
}
//# sourceMappingURL=IAuthResponseMapper.d.ts.map