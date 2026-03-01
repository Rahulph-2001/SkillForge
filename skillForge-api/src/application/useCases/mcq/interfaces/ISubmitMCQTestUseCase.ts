import { type SubmitMCQRequestDTO } from '../../../dto/mcq/SubmitMCQRequestDTO';
import { type SubmitMCQResponseDTO } from '../../../dto/mcq/SubmitMCQResponseDTO';

export interface ISubmitMCQTestUseCase {
  execute(request: SubmitMCQRequestDTO): Promise<SubmitMCQResponseDTO>;
}
