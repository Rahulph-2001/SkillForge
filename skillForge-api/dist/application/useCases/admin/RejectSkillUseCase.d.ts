import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IRejectSkillUseCase, RejectSkillDTO } from './interfaces/IRejectSkillUseCase';
export declare class RejectSkillUseCase implements IRejectSkillUseCase {
    private readonly skillRepository;
    constructor(skillRepository: ISkillRepository);
    execute(data: RejectSkillDTO): Promise<void>;
}
//# sourceMappingURL=RejectSkillUseCase.d.ts.map