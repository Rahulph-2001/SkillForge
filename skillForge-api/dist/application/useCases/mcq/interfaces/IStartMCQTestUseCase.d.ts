import { StartMCQRequestDTO } from '../../../dto/mcq/StartMCQRequestDTO';
import { StartMCQResponseDTO } from '../../../dto/mcq/StartMCQResponseDTO';
export interface IStartMCQTestUseCase {
    execute(request: StartMCQRequestDTO): Promise<StartMCQResponseDTO>;
}
//# sourceMappingURL=IStartMCQTestUseCase.d.ts.map