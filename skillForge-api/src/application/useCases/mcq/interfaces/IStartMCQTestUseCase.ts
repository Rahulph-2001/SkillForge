import { type StartMCQRequestDTO } from '../../../dto/mcq/StartMCQRequestDTO';
import { type StartMCQResponseDTO } from '../../../dto/mcq/StartMCQResponseDTO';

export interface IStartMCQTestUseCase {
  execute(request: StartMCQRequestDTO): Promise<StartMCQResponseDTO>;
}
