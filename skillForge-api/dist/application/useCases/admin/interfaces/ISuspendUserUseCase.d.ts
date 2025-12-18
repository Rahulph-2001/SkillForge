import { SuspendUserRequestDTO } from '../../../dto/admin/SuspendUserRequestDTO';
import { SuspendUserResponseDTO } from '../../../dto/admin/SuspendUserResponseDTO';
export interface ISuspendUserUseCase {
    execute(request: SuspendUserRequestDTO): Promise<SuspendUserResponseDTO>;
}
//# sourceMappingURL=ISuspendUserUseCase.d.ts.map