import { User } from '../../domain/entities/User';
import { UserAdminDTO } from '../dto/admin/UserAdminDTO';
import { IAdminUserDTOMapper } from './interfaces/IAdminUserDTOMapper';
export declare class AdminUserDTOMapper implements IAdminUserDTOMapper {
    toDTO(user: User): UserAdminDTO;
}
//# sourceMappingURL=AdminUserDTOMapper.d.ts.map