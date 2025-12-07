import { RegisterDTO } from '../../../dto/auth/RegisterDTO';
import { RegisterResponseDTO } from '../../../dto/auth/RegisterResponseDTO';
export interface IRegisterUseCase {
    execute(request: RegisterDTO, registrationIp?: string): Promise<RegisterResponseDTO>;
}
//# sourceMappingURL=IRegisterUseCase.d.ts.map