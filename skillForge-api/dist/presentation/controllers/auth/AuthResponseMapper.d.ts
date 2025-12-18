import { UserResponseDTO } from '../../../application/dto/auth/UserResponseDTO';
import { IAuthResponseMapper } from './interfaces/IAuthResponseMapper';
export interface AuthSuccessResponse<T> {
    success: true;
    data: T;
}
export interface AuthErrorResponse {
    success: false;
    error: string;
    details?: unknown;
}
export declare class AuthResponseMapper implements IAuthResponseMapper {
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
//# sourceMappingURL=AuthResponseMapper.d.ts.map