import { type Profile } from 'passport-google-oauth20';
import { type UserResponseDTO } from '../../../dto/auth/UserResponseDTO';

export interface GoogleAuthResponseDTO {
  user: UserResponseDTO;
  token: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface IGoogleAuthUseCase {
  execute(googleProfile: Profile): Promise<GoogleAuthResponseDTO>;
}

