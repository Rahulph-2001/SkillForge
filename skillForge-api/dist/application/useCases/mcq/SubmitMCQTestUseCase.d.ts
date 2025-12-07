import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { ISubmitMCQTestUseCase } from './interfaces/ISubmitMCQTestUseCase';
import { SubmitMCQRequestDTO } from '../../dto/mcq/SubmitMCQRequestDTO';
import { SubmitMCQResponseDTO } from '../../dto/mcq/SubmitMCQResponseDTO';
export declare class SubmitMCQTestUseCase implements ISubmitMCQTestUseCase {
    private mcqRepository;
    private skillRepository;
    constructor(mcqRepository: IMCQRepository, skillRepository: ISkillRepository);
    execute(request: SubmitMCQRequestDTO): Promise<SubmitMCQResponseDTO>;
}
//# sourceMappingURL=SubmitMCQTestUseCase.d.ts.map