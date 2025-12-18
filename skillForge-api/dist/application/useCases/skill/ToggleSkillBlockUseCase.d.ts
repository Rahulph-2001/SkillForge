import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
export interface IToggleSkillBlockUseCase {
    execute(skillId: string, providerId: string): Promise<Skill>;
}
export declare class ToggleSkillBlockUseCase implements IToggleSkillBlockUseCase {
    private skillRepository;
    constructor(skillRepository: ISkillRepository);
    execute(skillId: string, providerId: string): Promise<Skill>;
}
//# sourceMappingURL=ToggleSkillBlockUseCase.d.ts.map