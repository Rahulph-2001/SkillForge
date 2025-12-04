import { injectable } from 'inversify';
import { UserResponseDTO } from '../../../application/dto/auth/UserResponseDTO';
import { IAuthResponseMapper } from './interfaces/IAuthResponseMapper';
import { SUCCESS_MESSAGES } from '../../../config/messages';

export interface AuthSuccessResponse<T> {
  success: true;
  data: T;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

@injectable()
export class AuthResponseMapper implements IAuthResponseMapper {
  public mapRegisterResponse(email: string, expiresAt: string, message: string): AuthSuccessResponse<{ email: string; expiresAt: string; message: string }> {
    return {
      success: true,
      data: {
        email,
        expiresAt,
        message,
      },
    };
  }

  public mapLoginResponse(userResponse: UserResponseDTO, token: string, refreshToken: string): AuthSuccessResponse<{ user: UserResponseDTO; token: string; refreshToken: string }> {
    return {
      success: true,
      data: {
        user: userResponse,
        token: token,
        refreshToken: refreshToken,
      },
    };
  }

  public mapVerifyOtpResponse(userResponse: UserResponseDTO, message: string, token: string, refreshToken: string): AuthSuccessResponse<{ user: UserResponseDTO; message: string; token: string; refreshToken: string }> {
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

  public mapLogoutResponse(): AuthSuccessResponse<{ message: string }> {
    return {
      success: true,
      data: {
        message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS,
      },
    };
  }
}