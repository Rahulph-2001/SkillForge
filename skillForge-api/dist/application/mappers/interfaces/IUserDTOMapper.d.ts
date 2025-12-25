import { User } from '../../../domain/entities/User';
import { UserResponseDTO } from '../../dto/auth/UserResponseDTO';
export interface IUserDTOMapper {
    toUserResponseDTO(user: User): Promise<UserResponseDTO>;
}
//# sourceMappingURL=IUserDTOMapper.d.ts.map