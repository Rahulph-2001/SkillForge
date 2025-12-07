import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dto/auth/UserResponseDTO';
import { IUserDTOMapper } from './interfaces/IUserDTOMapper';
export declare class UserDTOMapper implements IUserDTOMapper {
    toUserResponseDTO(user: User): UserResponseDTO;
}
//# sourceMappingURL=UserDTOMapper.d.ts.map