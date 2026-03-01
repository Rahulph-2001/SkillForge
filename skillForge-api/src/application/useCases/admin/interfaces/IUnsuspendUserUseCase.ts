import { type SuspendUserRequestDTO } from '../../../dto/admin/SuspendUserRequestDTO';
import { type SuspendUserResponseDTO } from '../../../dto/admin/SuspendUserResponseDTO';

export interface IUnsuspendUserUseCase {
  execute(request: SuspendUserRequestDTO): Promise<SuspendUserResponseDTO>;
}
