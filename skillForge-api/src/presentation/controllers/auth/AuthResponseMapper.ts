import { UserResponseDTO } from '../../../application/dto/auth/UserResponseDTO';

export interface AuthSuccessResponse<T> {
  success: true;
  data: T;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export class AuthResponseMapper {
  public static mapRegisterResponse(email: string, expiresAt: string, message: string): AuthSuccessResponse<{ email: string; expiresAt: string; message: string }> {
    return {
      success: true,
      data: {
        email,
        expiresAt,
        message,
      },
    };
  }

  public static mapLoginResponse(userResponse: UserResponseDTO, token: string, refreshToken: string): AuthSuccessResponse<{ user: UserResponseDTO; token: string; refreshToken: string }> {
    return {
      success: true,
      data: {
        user: userResponse,
        token: token,
        refreshToken: refreshToken,
      },
    };
  }

  public static mapVerifyOtpResponse(userResponse: UserResponseDTO, message: string, token: string, refreshToken: string): AuthSuccessResponse<{ user: UserResponseDTO; message: string; token: string; refreshToken: string }> {
    return {
      success: true,
      data: {
        user: userResponse,
        message: message,
        token: token,
        refreshToken: refreshToken,
      },
    };
  }
}