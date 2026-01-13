import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUnblockSkillUseCase } from './interfaces/IUnblockSkillUseCase';
export declare class UnblockSkillUseCase implements IUnblockSkillUseCase {
    private readonly skillRepository;
    constructor(skillRepository: ISkillRepository);
    execute(skillId: string, _adminId: string): Promise<void>;
}
//# sourceMappingURL=UnblockSkillUseCase.d.ts.map