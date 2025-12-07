import { SubmitMCQRequestDTO } from '../../../dto/mcq/SubmitMCQRequestDTO';
import { SubmitMCQResponseDTO } from '../../../dto/mcq/SubmitMCQResponseDTO';
export interface ISubmitMCQTestUseCase {
    execute(request: SubmitMCQRequestDTO): Promise<SubmitMCQResponseDTO>;
}
//# sourceMappingURL=ISubmitMCQTestUseCase.d.ts.map