import { SuspendUserDTO } from '../user/SuspendUserDTO';

export interface SuspendUserRequestDTO extends SuspendUserDTO {
  adminUserId: string;
}
