import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IApproveSkillUseCase } from './interfaces/IApproveSkillUseCase';
export declare class ApproveSkillUseCase implements IApproveSkillUseCase {
    private readonly skillRepository;
    constructor(skillRepository: ISkillRepository);
    execute(skillId: string, _adminId: string): Promise<void>;
}
//# sourceMappingURL=ApproveSkillUseCase.d.ts.map