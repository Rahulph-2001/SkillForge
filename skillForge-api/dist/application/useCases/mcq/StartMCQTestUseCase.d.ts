import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IStartMCQTestUseCase } from './interfaces/IStartMCQTestUseCase';
import { StartMCQRequestDTO } from '../../dto/mcq/StartMCQRequestDTO';
import { StartMCQResponseDTO } from '../../dto/mcq/StartMCQResponseDTO';
export declare class StartMCQTestUseCase implements IStartMCQTestUseCase {
    private mcqRepository;
    private skillRepository;
    constructor(mcqRepository: IMCQRepository, skillRepository: ISkillRepository);
    execute(request: StartMCQRequestDTO): Promise<StartMCQResponseDTO>;
}
//# sourceMappingURL=StartMCQTestUseCase.d.ts.map