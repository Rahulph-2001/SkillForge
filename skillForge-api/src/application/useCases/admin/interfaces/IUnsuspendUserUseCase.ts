import { SuspendUserRequestDTO } from '../../../dto/admin/SuspendUserRequestDTO';
import { SuspendUserResponseDTO } from '../../../dto/admin/SuspendUserResponseDTO';

export interface IUnsuspendUserUseCase {
  execute(request: SuspendUserRequestDTO): Promise<SuspendUserResponseDTO>;
}
