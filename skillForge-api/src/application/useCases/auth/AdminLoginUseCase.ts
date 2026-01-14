import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { UnauthorizedError, NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { AdminLoginDTO } from '../../dto/auth/AdminLoginDTO';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IAdminLoginUseCase, AdminLoginResponseDTO } from './interfaces/IAdminLoginUseCase';

@injectable()
export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPasswordService) private passwordService: IPasswordService,
    @inject(TYPES.IJWTService) private jwtService: IJWTService,
    @inject(TYPES.IUserDTOMapper) private userDTOMapper: IUserDTOMapper
  ) { }

  async execute(request: AdminLoginDTO, ipAddress?: string): Promise<AdminLoginResponseDTO> {
    const { email: rawEmail, password } = request;

    const user = await this.userRepository.findByEmail(rawEmail);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isMatch = await this.passwordService.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.isActive || user.isDeleted) {
      throw new ForbiddenError('Your account has been suspended. Please contact support.');
    }
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    user.updateLastLogin(ipAddress || 'unknown');
    await this.userRepository.update(user);

    const tokenPayload = {
      userId: user.id,
      email: user.email.value,
      role: user.role,
    };
    const refreshTokenPayload = {
      userId: user.id,
      email: user.email.value,
    };
    const token = this.jwtService.generateToken(tokenPayload);
    const refreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload);
    return {
      user: await this.userDTOMapper.toUserResponseDTO(user),
      token,
      refreshToken,
    };
  }
}